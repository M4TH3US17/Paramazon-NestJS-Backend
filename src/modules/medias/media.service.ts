import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { MediaRepository } from "./media.repository";
import { MediaPaginationDTO } from "./dto/response/media.pagination.response";
import { MediaRequestDTO } from "./dto/request/media.create.dto";
import { MediaMapper } from "./media.mapping";
import { Response } from "src/utils/api.response";
import { MediaUpdateRequestDTO } from "./dto/request/update.data.dto";

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(
        private readonly repository: MediaRepository,
    ) { }

    public async findAll(pagination: MediaPaginationDTO): Promise<Response> {
        try {
            this.logger.log('MediaService :: Iniciando a consulta na base de dados...');
            const data = await this.repository.findAll(pagination);

            return new Response({
                message: "Segue a lista de mídias",
                data: {
                    results: MediaMapper.parseEntitiesToDTO(data.results),
                    totalItems: data.totalItems,
                    pagination: data.pagination,
                }
            });

        } catch (error) {
            this.logger.error('MediaService :: Erro ao buscar mídias', error.stack);
            throw error;
        }
    }

    public async findOne(mediaId: number): Promise<Response> {
        try {
            this.logger.log('MediaService :: Iniciando a consulta na base de dados...');
            const data = await this.repository.findOne(mediaId);

            if (!data) {
                this.logger.warn(`MediaService :: Mídia com ID ${mediaId} não encontrada.`);
                throw new NotFoundException(`Mídia com ID ${mediaId} não foi encontrada.`);
            }

            this.logger.log('MediaService :: Enviando dados para o frontend...');
            return new Response({
                message: `Mídia de ID ${mediaId} encontrada com sucesso.`,
                data: MediaMapper.parseToDTO(data),
            });
        } catch (error) {
            this.logger.error(`MediaService :: Erro ao buscar mídia de ID ${mediaId}`, error.stack);
            if (error.getStatus() === HttpStatus.NOT_FOUND)
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);

            throw error;
        }
    }

    public async create(request: MediaRequestDTO): Promise<Response> {
        try {
            this.logger.log('MediaService :: Iniciando persistência de uma nova mídia na base de dados...');

            const existingMedia = await this.repository.findAll({
                page: 0,
                size: 10,
                sort: 'source',
                order: 'asc',
                search: request.source
            });

            if (existingMedia.totalItems > 0) {
                throw new ConflictException(`Mídia com o source "${request.source}" já está em uso.`);
            }

            const data = await this.repository.create(request);

            return new Response({
                message: "Mídia cadastrada com sucesso",
                data: MediaMapper.parseToDTO(data),
            });
        } catch (error) {
            this.logger.error('MediaService :: Erro ao persistir mídia', error.stack);

            if (error instanceof ConflictException && error.getStatus() === HttpStatus.CONFLICT)
                throw new HttpException(`Mídia com o source ${request.source} já está em uso.`, HttpStatus.CONFLICT);

            throw error;
        }
    }

    public async update(mediaId: number, request: MediaUpdateRequestDTO): Promise<Response> {
        try {
            this.logger.log('MediaService :: Iniciando atualização da mídia na base de dados...');

            // Check if the media exists
            const mediaFound = await this.repository.findOne(mediaId);

            if (!mediaFound) {
                this.logger.warn(`MediaService :: Mídia com ID ${mediaId} não encontrada.`);
                throw new NotFoundException(`Mídia com ID ${mediaId} não foi encontrada.`);
            }

            // Check if there's a conflict with existing media
            const mediaWithSameSource = await this.repository.findAll({
                page: 0,
                size: 10,
                sort: 'source',
                order: 'asc',
                search: request.source
            });

            if (mediaWithSameSource.totalItems > 0) {
                this.logger.warn(`MediaService :: Mídia com source=${request.source} já existe.`);
                throw new ConflictException(`Mídia com source ${request.source} já existe.`);
            }

            const updatedMedia = await this.repository.update(mediaId, request);

            return new Response({
                message: 'Mídia atualizada com sucesso!',
                data: MediaMapper.parseToDTO(updatedMedia)
            });
        } catch (error) {
            this.logger.error('MediaService :: Erro ao atualizar mídia', error.stack);

            if (error instanceof NotFoundException)
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);

            if (error instanceof ConflictException && error.getStatus() === HttpStatus.CONFLICT)
                throw new HttpException(`Mídia com source ${request.source} já existe.`, HttpStatus.CONFLICT);

            throw error;
        }
    }

    public async delete(mediaId: number): Promise<Response> {
        try {
            this.logger.log('MediaService :: Iniciando a exclusão da mídia na base de dados...');

            const mediaToBeDeleted = await this.repository.findOne(mediaId);

            if (!mediaToBeDeleted) {
                this.logger.warn(`MediaService :: Mídia de ID=${mediaId} não encontrada.`);
                throw new NotFoundException(`Mídia de ID=${mediaId} não foi encontrada.`);
            }

            await this.repository.delete(mediaId);

            return new Response({
                message: "Mídia deletada com sucesso!",
            });
        } catch (error) {
            this.logger.error('MediaService :: Erro ao deletar mídia', error.stack);

            if (error instanceof NotFoundException)
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);

            throw error;
        }
    }
}
