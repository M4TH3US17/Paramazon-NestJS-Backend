import { IsInt, IsOptional, Min } from 'class-validator';

export class UserPaginationDTO {
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly page?: number = 1;
  
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly limit?: number = 10;
  }