import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MediaType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

export class MediaUpdateRequestDTO {
    @IsString()
    @IsNotEmpty({ message: "source field cannot be empty!" })
    @ApiProperty({ description: 'The source URL or path of the media', example: 'http://example.com/image.jpg' })
    source: string;

    @IsOptional()
    @IsEnum(MediaType, { message: 'media_type must be a valid enum value' })
    @ApiPropertyOptional({ description: 'The type of media', enum: MediaType })
    media_type?: MediaType;
}

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