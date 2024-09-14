import { IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class PaginationDefaultDTO {
  @IsString()
  @Matches(/^\d+$/, { message: 'Page must be a number' })
  readonly page?: number;

  @IsString()
  @Matches(/^\d+$/, { message: 'Page must be a number' })
  readonly size?: number;

  @IsOptional()
  @IsString()
  readonly sort?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  readonly order?: string;

  @IsOptional()
  @IsString()
  readonly search?: string;
}