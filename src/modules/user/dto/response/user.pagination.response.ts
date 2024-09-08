import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UserPaginationDTO {
  @IsOptional()
  @IsString()
  readonly page?: number;

  @IsOptional()
  @IsString()
  readonly size?: number;

  @IsOptional()
  @IsString()
  readonly sort?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'order deve ser "asc" ou "desc"' })
  readonly order?: string;

  @IsOptional()
  @IsString()
  readonly search?: string;
}