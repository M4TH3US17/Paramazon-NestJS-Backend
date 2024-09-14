import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MediaType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MediaResponse } from "../response/media.dto";

export class MediaRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "source field cannot be empty!" })
  @ApiProperty({ description: 'The source URL or path of the media', example: 'http://example.com/image.jpg' })
  source: string;

  @IsOptional()
  @IsEnum(MediaType, { message: 'media_type must be a valid enum value' })
  @ApiPropertyOptional({ description: 'The type of media', enum: MediaType })
  media_type?: MediaType;
}

// export class MediaEntity extends MediaResponse {
//   @ApiProperty({ description: 'The type of media', enum: MediaType })
//   media_type: MediaType;
// }
