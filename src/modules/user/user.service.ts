import { Injectable, Logger } from "@nestjs/common";
import { UserResponse } from "./dto/response/user.dto";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) { }

    public async findAll(pagination: UserPaginationDTO): Promise<UserResponse[]> {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;
    
        this.logger.log(`UserService :: Iniciando a busca de usuários. Parâmetros: página=${page}, limite=${limit}`);
        this.logger.log('UserService :: Calculando a partir de qual registro buscar: skip=' + skip);
    
        try {
          this.logger.log('UserService :: Iniciando a consulta na base de dados...');
          const list = await this.repository.find({ skip, take: limit });
    
          this.logger.log(`UserService :: ${list.length} usuário(s) encontrado(s). Enviando dados para o client-side...`);
    
          return list;
        } catch (error) {
          this.logger.error('UserService :: Erro ao buscar usuários', error.stack);
          throw error;
        }
      };

}