import { IsString, IsInt, Min, Max, IsOptional, IsIn, MinLength, IsDate } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(['ASC', 'DESC']))
  order: 'ASC' | 'DESC' = 'DESC';
}

export class KeywordDto {
  @IsDate()
  @IsOptional()
  fromDate: Date;

  @IsDate()
  @IsOptional()
  toDate: Date;

  @IsDate()
  @IsOptional()
  startTime: Date;

  @IsDate()
  @IsOptional()
  endTime: Date;

  @IsString()
  @IsOptional()
  @MinLength(1)
  keyword: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  keySearch: string;

  @IsString()
  @IsOptional()
  dateFilterField: string;
}
