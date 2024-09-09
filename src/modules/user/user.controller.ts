import { Body, Controller, Get, HttpStatus, Logger, Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";
import { ValidateUserPaginationPipe } from "./pipes/validate-user-pagination.pipe";
import { UserRequestDTO } from "./dto/request/user.create.dto";
import { IUserResponse } from "./dto/response/user.dto";

@ApiTags('usuarios')
@Controller("users")
export class UserController {

    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly service: UserService,
    ) { }

    @Get()
    @UsePipes(ValidateUserPaginationPipe)
    @ApiOperation({ summary: 'Retorna todos os usuarios cadastrados no sistema' })
    @ApiResponse({ status: HttpStatus.OK })
    public async findAll(@Query() pagination: UserPaginationDTO) {
        this.logger.log(`UserController :: Iniciando processo de busca de todos os usuarios cadastrados...`);
        const response = this.service.findAll(pagination);
        return response;
    };

    @Post()
    @ApiResponse({ status: HttpStatus.CREATED })
    @ApiOperation({ summary: 'Cadastra um novo usuario no sistema' })
    public async create(@Body() request: UserRequestDTO) {
        this.logger.log(`UserController :: Iniciando processo de persistencia de um novo usuario...`);
        const response = this.service.create(request);
        return response;
    }

}