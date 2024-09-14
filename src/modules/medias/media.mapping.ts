import { InternalServerErrorException } from "@nestjs/common";
import { MediaResponse } from "./dto/response/media.dto";

export class MediaMapper {

    constructor() { }

  /**
   * Converte uma lista de entidades para uma lista de DTOs de mídia.
   * 
   * @param entities - Array de entidades a serem convertidas para DTOs.
   * @returns Array de DTOs de mídia.
   * @throws InternalServerErrorException Se ocorrer um erro durante a conversão.
   */
    public static parseEntitiesToDTO(entities: any[]): MediaResponse[] {
        try {
            return entities.map(entity => this.parseToDTO(entity));
        } catch (error) {
            console.error('MediaMapper :: Erro ao converter entidades para DTOs', error.stack);
            throw new InternalServerErrorException('Erro ao converter entidades para DTOs');
        }
    }

  /**
   * Converte uma única entidade para um DTO de mídia.
   * 
   * @param entity - Entidade a ser convertida para DTO.
   * @returns DTO de mídia.
   * @throws InternalServerErrorException Se ocorrer um erro durante a conversão.
   */
    public static parseToDTO(entity: any): MediaResponse {
        try {
            const dto: MediaResponse = {
                media_id: Number(entity.media_id),
                source: entity.source,
                //media_type: entity.media_type,
                created_at: entity.created_at,
                updated_at: entity.updated_at,
            };

            return dto;
        } catch (error) {
            console.error('MediaMapper :: Erro ao converter entidade para DTO', error.stack);
            throw new InternalServerErrorException('Erro ao converter entidade para DTO');
        }
    }

}
