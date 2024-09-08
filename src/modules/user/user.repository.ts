import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";

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
                account_status: 'ACTIVE',
                username: {
                    contains: search,
                    mode: 'insensitive',
                }
            },
            include: { photograph: true },
        });

        const totalItems = results.length;

        this.logger.log(`UserRepository :: ${totalItems} usuário(s) encontrado(s)`);

        return { results, totalItems }
    };

};