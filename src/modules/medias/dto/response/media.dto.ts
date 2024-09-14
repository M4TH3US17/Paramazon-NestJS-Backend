import { ApiProperty } from "@nestjs/swagger";
import { MediaType } from "../../enums/media.enums";

export class MediaResponse {
    @ApiProperty({ description: 'The unique identifier for the media', example: 1 })
    media_id: number;

    @ApiProperty({ description: 'The source URL or path of the media', example: 'http://example.com/image.jpg' })
    source: string;

    // @ApiProperty({ description: 'The source media type', example: 'JPG, PNG, OTHER...' })
    // media_type: MediaType;

    @ApiProperty({ description: 'The creation date of the media', example: '2024-09-09T02:31:05.109Z' })
    created_at: Date;

    @ApiProperty({ description: 'The last update date of the media', example: '2024-09-09T02:31:05.109Z' })
    updated_at: Date;
}