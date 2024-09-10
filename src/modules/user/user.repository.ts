import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { UserRequestDTO } from "./dto/request/user.create.dto";
import { Status, UserRole } from "./enums/user.enum";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { MediaEntity } from "./dto/response/user.dto";
import { Prisma } from "@prisma/client";
import { UserUpdateRequestDTO } from "./dto/request/update.personal.data.dto";

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    public async findAll(pagination: UserPaginationDTO) {
        const { page, size, sort, order, search } = pagination;
        let skip = page * size;

        this.logger.log(`UserRepository :: Iniciando a busca de usuários. Parâmetros: página=${page}, size=${size}, sort=${sort}, order=${order}, search=${search}`);
        this.logger.log('UserRepository :: Calculando a partir de qual registro buscar: skip=' + skip);

        const results = await this.prisma.user.findMany({
            skip: skip,
            take: Number(size),
            orderBy: { [sort]: order },
            where: {
                account_status: Status.ACTIVE,
                username: {
                    contains: search,
                    mode: 'insensitive',
                }
            },
            include: { photograph: true },
        });

        const totalItems = results.length;

        this.logger.log(`UserRepository :: ${totalItems} usuário(s) encontrado(s)`);

        return { results, totalItems, pagination }
    };

    public async findOne(userId: number) {
        try {
            this.logger.log(`UserRepository :: Buscando na base de dados...`);
            const data = await this.prisma.user.findUnique({
                where: {
                    user_id: userId,
                    account_status: Status.ACTIVE,
                },
                include: {
                    photograph: true,
                }
            })

            if (!data) {
                this.logger.warn(`UserRepository :: Usuário com ID ${userId} não encontrado ou não está ativo.`);
                throw new NotFoundException(`Usuário com ID ${userId} não encontrado ou não está ativo.`);
            }

            this.logger.log(`UserRepository :: Retornando usuario encontrado para o UserService...`);
            return data;

        } catch (error) {
            this.logger.error(`UserRepository :: Erro ao buscar usuário de ID ${userId}`, error.stack);
            throw error;
        }
    };

    public async findUserByUsername(username: string) {
        try {
            this.logger.log(`UserRepository :: Buscando usuario de username=${username} na base de dados...`);
            const data = this.prisma.user.findUnique({
                where: {
                    username: username,
                    account_status: Status.ACTIVE,
                },
                select: {
                    username: true,
                    password: true,
                    user_role: true,
                }
            })

            if (!data) {
                this.logger.warn(`UserRepository :: Usuário com username=${username} não encontrado ou não está ativo.`);
                throw new NotFoundException(`Usuário com username=${username} não encontrado ou não está ativo.`);
            }

            this.logger.log(`UserRepository :: Retornando usuario encontrado para o UserService...`);
            return data;

        } catch (error) {
            this.logger.error(`UserRepository :: Erro ao buscar usuário de username=${username}`, error.stack);
            throw error;
        }
    }

    public async create(request: UserRequestDTO) {
        this.logger.log(`UserRepository :: Salvando usuario de username ${request.username} ...`);

        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                let media_id = null;
                const hasPhotograph: boolean = (request.photograph && request.photograph.source && request.photograph.source.trim() !== '');

                if (hasPhotograph) {
                    this.logger.log(`UserRepository :: Salvando foto do usuario ...`);
                    const mediaSaved = await prisma.media.create({
                        data: {
                            source: request.photograph.source,
                            media_type: request.photograph.media_type,
                            created_at: new Date(),
                            updated_at: new Date(),
                        }
                    });

                    media_id = mediaSaved.media_id;
                }

                this.logger.log(`UserRepository :: Verificando se existe usuario cadastrado como username=${request.username} ...`);
                const existingUser = await prisma.user.findUnique({
                    where: { username: request.username },
                });

                if (existingUser)
                    throw new ConflictException('Username already exists');

                const userSaved = await prisma.user.create({
                    data: {
                        username: request.username,
                        password: request.password,
                        photograph_fk: media_id,
                        user_role: UserRole.USER,
                        account_status: Status.ACTIVE,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    include: { photograph: true }
                });

                this.logger.log(`UserRepository :: Usuario salvo na base`);
                return userSaved;
            });

            return result;
        } catch (error) {

            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002')
                throw new ConflictException('Username already exists');

            this.logger.error('UserRepository :: Erro ao salvar usuário', error.stack);
            throw new InternalServerErrorException('Erro interno ao salvar usuário');
        }
    }

    public async update(userId: number, request: UserUpdateRequestDTO) {
        this.logger.log(`UserRepository :: Buscando usuário de ID=${userId} na base de dados...`);
        try {
            const [entity] = await this.prisma.$transaction([
                this.prisma.user.findUnique({
                    where: { user_id: userId, account_status: Status.ACTIVE },
                    include: { photograph: true }
                })
            ]);

            if(!entity) {
                throw new NotFoundException(`Usuario de ID=${userId} nao encontrado.`)
            }
    
            // Verificar se o username já existe
            if (request.username && request.username !== entity.username) {
                this.logger.log(`UserRepository :: Verificando se já existe usuário com username=${request.username}...`);
                const usernameAlreadyExists = await this.prisma.user.findUnique({
                    where: { username: request.username },
                });
    
                if (usernameAlreadyExists) {
                    this.logger.warn(`UserRepository :: Já existe um usuário com username=${request.username}...`);
                    throw new ConflictException(`Usuário com username=${request.username} já existe na base de dados!`);
                }
            }
    
            this.logger.log(`UserRepository :: Checando a parte de foto do usuario...`);
            let media = undefined;
    
            if (request.photograph) {
                if (entity.photograph) {
                    this.logger.log(`UserRepository :: Atualizando dados da foto existente com media_id=${entity.photograph.media_id}...`);
                    media = {
                        media_id: Number(entity.photograph.media_id),
                        source: request.photograph.source,
                        media_type: request.photograph.media_type,
                        updated_at: new Date(),
                    };
                } else {
                    this.logger.log(`UserRepository :: Adicionando nova foto...`);
                    media = {
                        source: request.photograph.source,
                        media_type: request.photograph.media_type,
                        created_at: new Date(),
                        updated_at: new Date(),
                    };
                }
            }
    
            const updateData: Prisma.UserUpdateInput = {
                username: request.username,
                photograph: media ? { update: media } : undefined,
                updated_at: new Date(),
            };
    
            const [updatedUser] = await this.prisma.$transaction([
                this.prisma.user.update({
                    where: {
                        user_id: userId,
                    },
                    data: updateData,
                }),
            ]);
    
            this.logger.log(`UserRepository :: Usuário de ID=${userId} atualizado com sucesso. Retornando dados para o service...`);
            return updatedUser;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002')
                throw new ConflictException('Esse username ja existe.');

            this.logger.error('UserRepository :: Erro ao atualizar usuário', error.stack);
            throw new InternalServerErrorException('Erro ao atualizar usuário');
        }
    }
    
    

    public async deactivate(userId: number) {
        this.logger.log(`UserRepository :: Buscando usuário de ID=${userId} na base de dados...`);
        try {
            const user = await this.prisma.user.findUnique({
                where: { user_id: userId, account_status: Status.ACTIVE },
            });
    
            if (!user) {
                this.logger.warn(`UserRepository :: Usuário de ID=${userId} não existe ou não está ativo.`);
                throw new NotFoundException(`Usuário de ID=${userId} não encontrado ou já está inativo.`);
            }
    
            const updatedUser = await this.prisma.user.update({
                where: { user_id: userId },
                data: { account_status: Status.INACTIVE }
            });
    
            this.logger.log(`UserRepository :: Usuário de ID=${userId} desativado com sucesso.`);
            return updatedUser;
        } catch (error) {
            this.logger.error('UserRepository :: Erro ao desativar usuário', error.stack);
            throw error;
        }
    }

};