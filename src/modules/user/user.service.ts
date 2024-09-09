import { Injectable, Logger } from "@nestjs/common";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { UserRepository } from "./user.repository";
import { UserRequestDTO } from "./dto/request/user.create.dto";
import { UserMapper } from "./user.mapping";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly repository: UserRepository,
  ) { }

  public async findAll(pagination: UserPaginationDTO) {
    try {
      this.logger.log('UserService :: Iniciando a consulta na base de dados...');
      const data = await this.repository.findAll(pagination);

      return {
        message: "segue a lista de usuarios",
        data: {
          results: UserMapper.parseEntitiesToDTO(data.results),
          totalItems: data.totalItems,
          pagination: data.pagination,
        }
      };

    } catch (error) {
      this.logger.error('UserService :: Erro ao buscar usuários', error.stack);
      throw error;
    }
  };

  public async create(request: UserRequestDTO) {
    try {
      this.logger.log('UserService :: Iniciando persistencia de um novo usuario na base de dados...');
      const data = await this.repository.create(request);

      return {
        message: "usuario cadastrado com sucesso",
        data: UserMapper.parseToDTO(data),
      }
    } catch (error) {
      this.logger.error('UserService :: ', error.stack);
      throw error;
    }
  };

}