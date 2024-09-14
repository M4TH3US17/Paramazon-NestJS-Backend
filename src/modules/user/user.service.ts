import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException, Res } from "@nestjs/common";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { UserRepository } from "./user.repository";
import { UserRequestDTO } from "./dto/request/user.create.dto";
import { UserMapper } from "./user.mapping";
import { UserUpdateRequestDTO } from "./dto/request/update.personal.data.dto";
import { Response } from "src/utils/api.response";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly repository: UserRepository,
  ) { }

  public async findAll(pagination: UserPaginationDTO): Promise<Response> {
    try {
      this.logger.log('UserService :: Iniciando a consulta na base de dados...');
      const data = await this.repository.findAll(pagination);

      return new Response({
        message: "segue a lista de usuarios",
        data: {
          results: UserMapper.parseEntitiesToDTO(data.results),
          totalItems: data.totalItems,
          pagination: data.pagination,
        }
      });

    } catch (error) {
      this.logger.error('UserService :: Erro ao buscar usuários', error.stack);
      throw error;
    }
  };

  public async findOne(userId: number): Promise<Response> {
    try {
      this.logger.log('UserService :: Iniciando a consulta na base de dados...');
      const data = await this.repository.findOne(userId);

      if (!data) {
        this.logger.warn(`UserService :: Usuário com ID ${userId} não encontrado ou não está ativo.`);
        throw new NotFoundException(`Usuário com ID ${userId} não foi encontrado ou não está ativo.`);
      }

      this.logger.log('UserService :: Enviando dados para o frontend...');
      return new Response({
        message: `Usuário de ID ${userId} econtrado com sucesso.`,
        data: UserMapper.parseToDTO(data),
      })
    } catch (error) {
      this.logger.error(`UserService :: Erro ao buscar usuário de ID ${userId} `, error.stack);
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  };

  public async findUserByUsername(username: string): Promise<any> {
    try {
      this.logger.log('UserService :: Iniciando a consulta na base de dados...');
      const data = await this.repository.findUserByUsername(username);

      if (!data) {
        this.logger.warn(`UserService :: Usuário com username=${username} não encontrado ou não está ativo.`);
        throw new NotFoundException(`Usuário de username=${username} não foi encontrado ou não está ativo.`);
      }

      return data
    } catch (error) {
      this.logger.error(`UserService :: Erro ao buscar usuário de username=${username} `, error.stack);
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  }

  public async create(request: UserRequestDTO): Promise<Response> {
    try {
      this.logger.log('UserService :: Iniciando persistencia de um novo usuario na base de dados...');

      this.logger.log(`UserService :: Verificando se existe usuario cadastrado como username=${request.username} ...`);
      const existingUser = await this.repository.findUserByUsername(request.username);

      this.logger.log(`UserService :: Verificando se as senhas informadas coincidem ...`);
      const passwordsMatchIsInvalid = (request.password.toUpperCase().trim() !== request.repeatPassword.toUpperCase().trim());

      if (passwordsMatchIsInvalid)
        throw new BadRequestException("As senhas informadas não coincidem.");

      if (existingUser)
        throw new ConflictException(`username "${request.username}" ja esta em uso.`);

      const data = await this.repository.create(request);

      return new Response({
        message: "usuario cadastrado com sucesso",
        data: UserMapper.parseToDTO(data),
      })
    } catch (error) {
      this.logger.error('UserService :: ao persistir usuario ', error.stack);

      if (error instanceof BadRequestException)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      if (error instanceof ConflictException && error.getStatus() === HttpStatus.CONFLICT)
        throw new HttpException(`username ${request.username} já está em uso.`, HttpStatus.CONFLICT);

      throw error;
    }
  };

  public async delete(userId: number): Promise<Response> {
    try {
      this.logger.log('UserService :: Iniciando desativaxao do usuario na base de dados...');
      const userToBeDeletedNotExists = await this.repository.findOne(userId);

      if (!userToBeDeletedNotExists) {
        this.logger.warn(`UserService :: Usuário de ID=${userId} não existe ou não está ativo.`);
        throw new NotFoundException(`Usuário de ID=${userId} já estava inativo ou não existe.`);
      }

      await this.repository.deactivate(userId);

      return new Response({
        message: "Usuario deletado com sucesso!",
      })
    } catch (error) {
      this.logger.error('UserService :: Erro ao desativar usuario ', error.stack);

      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  };

  public async update(userId: number, request: UserUpdateRequestDTO): Promise<Response> {
    try {
      this.logger.log('UserService :: Iniciando atualizacao do usuario na base de dados. Verificando se usuario existe...');
      const userFound = await this.repository.findOne(userId);

      this.logger.log(`UserService :: Verificando se ja existe usuario de username=${request.username}`);
      const usernameAlreadyExists = await this.repository.findUserByUsername(request.username);

      if (!userFound) {
        this.logger.warn(`UserService :: Usuário com ID ${userId} não encontrado ou não está ativo.`);
        throw new NotFoundException(`Usuário com ID ${userId} não encontrado ou não está ativo.`);
      }

      if (usernameAlreadyExists) {
        this.logger.warn(`UserService :: Usuário de username=${request.username} ja existe.`);
        throw new ConflictException(`Username ${request.username} ja existe.`);
      }

      let media = undefined;

      if (request.photograph) {
        if (userFound.photograph) {
          this.logger.log(`UserService :: Atualizando dados da foto existente com media_id=${userFound.photograph.media_id}...`);
          media = {
            media_id: Number(userFound.photograph.media_id),
            source: request.photograph.source,
            media_type: request.photograph.media_type,
            updated_at: new Date(),
          };
        } else {
          this.logger.log(`UserService :: Adicionando nova foto...`);
          media = {
            source: request.photograph.source,
            media_type: request.photograph.media_type,
            created_at: new Date(),
            updated_at: new Date(),
          };
        }
      }

      userFound.updated_at = new Date();
      userFound.username = request.username,
        userFound.photograph = media;

      const userUpdated = await this.repository.update(userId, userFound);

      return new Response({
        message: 'Usuario atualizado com sucesso!',
        data: UserMapper.parseToDTO(userUpdated)
      });

    } catch (error) {
      this.logger.error('UserService :: ao persistir atualizar usuario ', error.stack);

      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      if (error instanceof ConflictException && error.getStatus() === HttpStatus.CONFLICT)
        throw new HttpException(`Username ${request.username} ja existe.`, HttpStatus.CONFLICT);

      throw error;
    }
  }

}