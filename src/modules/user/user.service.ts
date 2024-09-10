import { Injectable, Logger } from "@nestjs/common";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { UserRepository } from "./user.repository";
import { UserRequestDTO } from "./dto/request/user.create.dto";
import { UserMapper } from "./user.mapping";
import { UserUpdateRequestDTO } from "./dto/request/update.personal.data.dto";

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

  public async findOne(userId: number) {
    try {
      this.logger.log('UserService :: Iniciando a consulta na base de dados...');
      const data = await this.repository.findOne(userId);

      this.logger.log('UserService :: Enviando dados para o frontend...');
      return {
        message: `Usuário de ID ${userId} econtrado com sucesso.`,
        data: UserMapper.parseToDTO(data),
      }
    } catch (error) {
      this.logger.error(`UserService :: Erro ao buscar usuário de ID ${userId} `, error.stack);
      throw error;
    }
  };

  public async findUserByUsername(username: string) {
    try {
      this.logger.log('UserService :: Iniciando a consulta na base de dados...');
      const data = await this.repository.findUserByUsername(username);

      return data;
    } catch (error) {
      this.logger.error(`UserService :: Erro ao buscar usuário de username=${username} `, error.stack);
      throw error;
    }
  }

  public async create(request: UserRequestDTO) {
    try {
      this.logger.log('UserService :: Iniciando persistencia de um novo usuario na base de dados...');
      const data = await this.repository.create(request);

      return {
        message: "usuario cadastrado com sucesso",
        data: UserMapper.parseToDTO(data),
      }
    } catch (error) {
      this.logger.error('UserService :: ao persistir usuario ', error.stack);
      throw error;
    }
  };

  public async delete(userId: number) {
    try {
      this.logger.log('UserService :: Iniciando desativaxao do usuario na base de dados...');
      await this.repository.deactivate(userId);

      return {
        message: "Usuario deletado com sucesso!",
      }
    } catch (error) {
      this.logger.error('UserService :: Erro ao desativar usuario ', error.stack);
      throw error;
    }
  };

  public async update(userId: number, request: UserUpdateRequestDTO) {
    try {
      this.logger.log('UserService :: Iniciando atualizacao do usuario na base de dados...');
      const userUpdated = await this.repository.update(userId, request);

      return {
        message: "Usuario atualizado com sucesso!",
        data: UserMapper.parseToDTO(userUpdated),
      }
    } catch (error) {
      this.logger.error('UserService :: ao persistir atualizar usuario ', error.stack);
      throw error;
    }
  }

}