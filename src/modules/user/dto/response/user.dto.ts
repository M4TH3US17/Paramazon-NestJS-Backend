import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Status, UserRole } from "../../enums/user.enum";
import { MediaResponse } from "src/modules/medias/dto/response/media.dto";

export class UserResponse {
    @ApiProperty({ description: 'The unique identifier for the user', example: 1 })
    user_id: number;

    @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
    username: string;

    @ApiProperty({ description: 'The role assigned to the user', enum: UserRole })
    user_role: UserRole;

    @ApiProperty({ description: 'The creation date of the user', example: '2024-09-09T02:31:05.109Z' })
    created_at: Date;

    @ApiProperty({ description: 'The last update date of the user', example: '2024-09-09T02:31:05.109Z' })
    updated_at: Date;

    @ApiPropertyOptional({ description: 'The foreign key reference to the photograph media', example: 1 })
    photograph_fk?: number;

    @ApiProperty({ description: 'Details of the photograph media associated with the user', type: MediaResponse })
    photograph: MediaResponse;
}

export class UserEntity extends UserResponse {
    @ApiProperty({ description: 'The password of the user', example: 'password123' })
    password: string;

    @ApiProperty({ description: 'The account status of the user', enum: Status })
    account_status: Status;
}