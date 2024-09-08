import { Controller, Get, HttpStatus, Logger, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserResponse } from "./dto/response/user.dto";
import { UserPaginationDTO } from "./dto/response/user.pagination.response";

@ApiTags('usuarios')
@Controller("users")
export class UserController {

    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly service: UserService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Retorna todos os usuarios cadastrados no sistema' })
    @ApiResponse({ status: HttpStatus.OK })
    public async findAll(@Query() pagination: UserPaginationDTO): Promise<UserResponse[]> {
        this.logger.log(`UserController :: Iniciando processo de busca de todos os usuarios cadastrados...`);
        const response = this.service.findAll(pagination);
        return response;
    };

}