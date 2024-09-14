import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { MediaPaginationDTO } from "./dto/response/media.pagination.response";
import { MediaRequestDTO } from "./dto/request/media.create.dto";
import { MediaType } from "./enums/media.enums";

@Injectable()
export class MediaRepository {
    private readonly logger = new Logger(MediaRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    public async findAll(pagination: MediaPaginationDTO) {
        const { page, size, sort, order, search } = pagination;
        let skip = page * size;

        this.logger.log(`MediaRepository :: Iniciando a busca de mídias. Parâmetros: página=${page}, size=${size}, sort=${sort}, order=${order}, search=${search}`);
        this.logger.log('MediaRepository :: Calculando a partir de qual registro buscar: skip=' + skip);

        const results = await this.prisma.media.findMany({
            skip: skip,
            take: Number(size),
            orderBy: { [sort]: order },
            where: {
                source: {
                    contains: search,
                    mode: 'insensitive',
                }
            },
        });

        const totalItems = results.length;

        this.logger.log(`MediaRepository :: ${totalItems} mídia(s) encontrada(s)`);

        return { results, totalItems, pagination };
    }

    public async findOne(mediaId: number) {
        try {
            this.logger.log(`MediaRepository :: Buscando mídia de ID=${mediaId} na base de dados...`);
            const data = await this.prisma.media.findUnique({
                where: { media_id: mediaId }
            });

            this.logger.log(`MediaRepository :: Retornando mídia encontrada para o MediaService...`);
            return data;

        } catch (error) {
            this.logger.error(`MediaRepository :: Erro ao buscar mídia de ID=${mediaId}`, error.stack);
            throw new InternalServerErrorException('Erro ao buscar mídia por ID');
        }
    }

    public async create(request: MediaRequestDTO) {
        this.logger.log(`MediaRepository :: Salvando mídia de source ${request.source} ...`);

        try {
            const result = await this.prisma.media.create({
                data: {
                    source: request.source,
                    media_type: request.media_type,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            });

            this.logger.log(`MediaRepository :: Mídia salva na base`);
            return result;
        } catch (error) {
            this.logger.error('MediaRepository :: Erro ao salvar mídia', error.stack);
            throw new InternalServerErrorException('Erro ao salvar mídia');
        }
    }

    public async update(mediaId: number, entity: any) {
        try {
            this.logger.log(`MediaRepository :: Atualizando mídia...`);

            const updatedMedia = await this.prisma.media.update({
                where: { media_id: mediaId },
                data: {
                    source: entity.source,
                    media_type: entity.media_type,
                    updated_at: new Date(),
                }
            });

            this.logger.log(`MediaRepository :: Mídia de ID=${mediaId} atualizada com sucesso.`);
            return updatedMedia;
        } catch (error) {
            this.logger.error('MediaRepository :: Erro ao atualizar mídia', error.stack);
            throw new InternalServerErrorException('Erro ao atualizar mídia');
        }
    }

    public async delete(mediaId: number) {
        this.logger.log(`MediaRepository :: Deletando mídia de ID=${mediaId}...`);
        try {
            const deletedMedia = await this.prisma.media.delete({
                where: { media_id: mediaId }
            });

            this.logger.log(`MediaRepository :: Mídia de ID=${mediaId} deletada com sucesso.`);
            return deletedMedia;
        } catch (error) {
            this.logger.error('MediaRepository :: Erro ao deletar mídia', error.stack);
            throw new InternalServerErrorException('Erro ao deletar mídia');
        }
    }
}
