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

  @IsString({ message: 'Password must be a string' })
  @MinLength(1, { message: 'Password must be at least 1 character long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @IsNotEmpty({ message: 'Password field cannot be empty!' })
  @ApiProperty({ description: 'The password of the user', example: 'password123', minLength: 1, maxLength: 20, })
  password: string;

  @IsString({ message: 'Repeat password must be a string' })
  @MinLength(1, { message: 'Repeat password must be at least 1 character long' })
  @MaxLength(20, { message: 'Repeat password must be at most 20 characters long' })
  @IsNotEmpty({ message: 'Repeat password field cannot be empty!' })
  @ApiProperty({ description: 'The password of the user, repeated for confirmation', example: 'password123', minLength: 1, maxLength: 20, })
  repeatPassword: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaRequestDTO)
  @ApiPropertyOptional({ description: 'Optional photograph details for the user' })
  photograph?: MediaRequestDTO;
  
}