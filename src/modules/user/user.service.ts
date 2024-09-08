import { Injectable, Logger } from "@nestjs/common";
import { UserResponse } from "./dto/response/user.dto";
//import { UserEntity } from "./entity/user.entity";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
      private readonly prisma: PrismaService,
    ) { }

    public async findAll(pagination: UserPaginationDTO): Promise<UserResponse[]> {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;
    
        this.logger.log(`UserService :: Iniciando a busca de usuários. Parâmetros: página=${page}, limite=${limit}`);
        this.logger.log('UserService :: Calculando a partir de qual registro buscar: skip=' + skip);
    
        try {
          this.logger.log('UserService :: Iniciando a consulta na base de dados...');
          
          const list = await this.prisma.user.findMany({
            skip,
            take: limit,
            where: {
              account_status: 'ACTIVE'
            },
            //include: { photograph: true },
          });

          console.log(list)
    
          this.logger.log(`UserService :: ${list.length} usuário(s) encontrado(s). Enviando dados para o client-side...`);
    
          return [];
        } catch (error) {
          this.logger.error('UserService :: Erro ao buscar usuários', error.stack);
          throw error;
        }
      };

}