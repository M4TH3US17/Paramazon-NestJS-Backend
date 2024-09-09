import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { UserRequestDTO } from "./dto/request/user.create.dto";
import { Status, UserRole } from "./enums/user.enum";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

};