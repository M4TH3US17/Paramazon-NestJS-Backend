import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { MediaUpdateRequestDTO } from "src/modules/medias/dto/request/update.data.dto";

export class UserUpdateRequestDTO {
    @IsOptional()
    @IsString({ message: "The username must be string"})
    @MinLength(1, { message: 'username must be at least 1 character long' })
    @MaxLength(20, { message: 'username must be at most 20 characters long' })
    @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
    username?: string;

    @IsOptional()
    @IsString({ message: "The password must be string"})
    @MinLength(1, { message: 'password must be at least 1 character long' })
    @MaxLength(20, { message: 'password must be at most 20 characters long' })
    @ApiProperty({ description: 'The password of the user', example: 'password123' })
    password?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => MediaUpdateRequestDTO)
    @ApiPropertyOptional({ description: 'Optional photograph details for the user' })
    photograph?: MediaUpdateRequestDTO;
}