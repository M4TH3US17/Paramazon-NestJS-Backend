import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MediaRequestDTO } from "src/modules/medias/dto/request/media.create.dto";

export class UserRequestDTO {
  @IsString()
  @MinLength(1, { message: 'username must be at least 1 character long' })
  @MaxLength(20, { message: 'username must be at most 20 characters long' })
  @IsNotEmpty({ message: "Username field cannot be empty!" })
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  username: string;

  @IsString()
  @MinLength(1, { message: 'password must be at least 1 character long' })
  @MaxLength(20, { message: 'password must be at most 20 characters long' })
  @IsNotEmpty({ message: "Password field cannot be empty!" })
  @ApiProperty({ description: 'The password of the user', example: 'password123' })
  password: string;

 // repeatPassword: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaRequestDTO)
  @ApiPropertyOptional({ description: 'Optional photograph details for the user' })
  photograph?: MediaRequestDTO;
}