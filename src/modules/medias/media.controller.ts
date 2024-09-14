import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";
import { MediaService } from "./media.service";
import { MediaRequestDTO } from "./dto/request/media.create.dto";
import { MediaPaginationDTO } from "./dto/response/media.pagination.response";
import { Response } from "src/utils/api.response";
import { ValidateMediaPaginationPipe } from "./pipes/validation-media.pipe";
import { MediaResponse } from "./dto/response/media.dto";
import { MediaUpdateRequestDTO } from "./dto/request/update.data.dto";

@ApiTags('Medias')
@Controller(process.env.API_VERSION_PATH + 'medias')
export class MediaController {

    private readonly logger = new Logger(MediaController.name);

    constructor(
        private readonly service: MediaService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidateMediaPaginationPipe)
    @ApiOperation({ summary: 'Retorna todos os mídias cadastrados no sistema' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de mídias encontradas',
        type: [MediaResponse]
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Parâmetros de consulta inválidos'
    })
    public async findAll(@Query() pagination: MediaPaginationDTO): Promise<Response> {
        this.logger.log('MediaController :: Iniciando processo de busca de todas as mídias cadastradas...');
        const response = await this.service.findAll(pagination);
        return response;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna uma mídia pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da mídia a ser retornada', type: Number })
    @ApiResponse({ status: HttpStatus.OK, description: 'Mídia encontrada com sucesso', type: MediaResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Mídia não encontrada' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ID inválido' })
    public async findOne(@Param('id') mediaId: number): Promise<Response> {
        this.logger.log(`MediaController :: Iniciando processo de busca da mídia de ID ${mediaId}...`);
        const response = await this.service.findOne(mediaId);
        return response;
    }

    @Post()
    @ApiOperation({ summary: 'Cadastra uma nova mídia no sistema' })
    @ApiBody({ description: 'Dados da nova mídia', type: MediaRequestDTO })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Mídia criada com sucesso' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Solicitação inválida' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Erro interno do servidor' })
    public async create(@Body() request: MediaRequestDTO): Promise<Response> {
        this.logger.log('MediaController :: Iniciando processo de persistência de uma nova mídia...');
        const response = await this.service.create(request);
        return response;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza uma mídia no sistema' })
    @ApiParam({ name: 'id', description: 'ID da mídia a ser atualizada', type: Number })
    @ApiBody({ description: 'Dados a serem atualizados', type: MediaUpdateRequestDTO })
    @ApiResponse({ status: HttpStatus.OK, description: 'Mídia atualizada com sucesso' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Mídia não encontrada' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Solicitação inválida' })
    public async update(@Param('id') mediaId: number, @Body() request: MediaUpdateRequestDTO): Promise<Response> {
        this.logger.log(`MediaController :: Iniciando processo de atualização da mídia de ID ${mediaId}...`);
        const response = await this.service.update(mediaId, request);
        return response;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deleta uma mídia no sistema' })
    @ApiParam({ name: 'id', description: 'ID da mídia a ser deletada', type: Number })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Mídia deletada com sucesso' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Mídia não encontrada' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ID inválido' })
    public async delete(@Param('id') mediaId: number): Promise<Response> {
        this.logger.log(`MediaController :: Iniciando processo de desativação da mídia de ID ${mediaId}...`);
        const response = await this.service.delete(mediaId);
        return response;
    }

}