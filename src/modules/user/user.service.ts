import { Injectable, Logger } from "@nestjs/common";
import { UserResponse } from "./dto/response/user.dto";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly repository: UserRepository,
  ) { }

  public async findAll(pagination: UserPaginationDTO): Promise<UserResponse[]> {
    try {
      this.logger.log('UserService :: Iniciando a consulta na base de dados...');
      const list = await this.repository.findAll(pagination);

      console.log(list)

      return [];
    } catch (error) {
      this.logger.error('UserService :: Erro ao buscar usuários', error.stack);
      throw error;
    }
  };

}