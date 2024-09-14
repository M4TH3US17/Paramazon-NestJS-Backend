import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, Query, Res, UsePipes } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { ValidateUserPaginationPipe } from "./pipes/validate-user-pagination.pipe";
import { UserRequestDTO } from "./dto/request/user.create.dto";
import { UserUpdateRequestDTO } from "./dto/request/update.personal.data.dto";
import { UserResponse } from "./dto/response/user.dto";
import { Response } from "src/utils/api.response";

@ApiTags('usuarios')
@Controller(process.env.API_VERSION_PATH + "users")
export class UserController {

    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly service: UserService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidateUserPaginationPipe)
    @ApiOperation({ summary: 'Retorna todos os usuários cadastrados no sistema' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de usuários encontrados',
        type: [UserResponse]
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Parâmetros de consulta inválidos'
    })
    public async findAll(@Query() pagination: UserPaginationDTO): Promise<Response> {
        this.logger.log(`UserController :: Iniciando processo de busca de todos os usuarios cadastrados...`);
        const response = this.service.findAll(pagination);
        return response;
    };

    @Get(':id')
    @ApiOperation({ summary: 'Retorna um usuário pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do usuário a ser retornado', type: Number })
    @ApiResponse({ status: HttpStatus.OK, description: 'Usuário encontrado com sucesso', type: UserResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ID inválido' })
    public async findOne(@Param('id') userId: number): Promise<Response> {
        this.logger.log(`UserController :: Iniciando processo de busca do usuario de ID ${userId} ...`);
        const response = this.service.findOne(userId);
        return response;
    };

    @Post()
    @ApiOperation({ summary: 'Cadastra um novo usuário no sistema' })
    @ApiBody({ description: 'Dados do novo usuário', type: UserRequestDTO })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuário criado com sucesso' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Solicitação inválida' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Erro interno do servidor' })
    public async create(@Body() request: UserRequestDTO): Promise<Response> {
        this.logger.log(`UserController :: Iniciando processo de persistencia de um novo usuario...`);
        const response = this.service.create(request);
        return response;
    };

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza um usuário no sistema' })
    @ApiParam({ name: 'id', description: 'ID do usuário a ser atualizado', type: Number })
    @ApiBody({ description: 'Dados a serem atualizados', required: true, type: UserUpdateRequestDTO })
    @ApiResponse({ status: HttpStatus.OK, description: 'Usuário atualizado com sucesso' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Solicitação inválida' })
    public async update(@Param('id') userId, @Body() request: UserUpdateRequestDTO): Promise<Response> {
        this.logger.log(`UserController :: Iniciando processo de atualizacao do usuario de ID ${userId}...`);
        const response = this.service.update(userId, request);;
        return response;
    };

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID supplied' })
    @ApiOperation({ summary: 'Deleta um usuario no sistema' })
    @ApiParam({ name: 'id', description: 'ID do usuario a ser deletado', type: Number })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Usuario deletado com sucesso' })
    public async delete(@Param('id') userId: number): Promise<Response> {
        this.logger.log(`UserController :: Iniciando processo de desativacao do usuario de ID ${userId}...`);
        const response = this.service.delete(userId);
        return response;
    };

}