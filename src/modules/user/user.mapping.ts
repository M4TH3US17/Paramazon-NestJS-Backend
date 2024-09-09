import { InternalServerErrorException, Logger } from "@nestjs/common";
import { IUserResponse } from "./dto/response/user.dto";

export class UserMapper {

    constructor(){}

    public static parseEntitiesToDTO(entities: any[]): IUserResponse[] {
        try {
            return entities.map(entity => this.parseToDTO(entity));
        } catch (error) {
            console.error('UserMapper :: ', error.stack);
            throw new InternalServerErrorException('Erro ao converter entidades para DTOs');
        }
    }

    public static parseToDTO(entity: any): IUserResponse {
        try {
            const dto: IUserResponse = {
                user_id: Number(entity.user_id),
                username: entity.username,
                user_role: entity.user_role,
                created_at: entity.created_at,
                updated_at: entity.updated_at,
                photograph: {
                    media_id: Number(entity.photograph.media_id),
                    source: entity.photograph.source,
                    created_at: entity.photograph.created_at,
                    updated_at: entity.photograph.updated_at
                },
            };
    
            return dto;
        } catch (error) {
            console.error('UserMapper :: ', error.stack);
            throw new InternalServerErrorException('Erro ao converter entidade para DTO');
        }
    }
    

}