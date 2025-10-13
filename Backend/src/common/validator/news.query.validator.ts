import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class NewsQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sort: string;

  @ApiProperty({ required: false, default: 'ASC', enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  order = 'ASC';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumberString()
  page: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumberString()
  limit: string;

  @ApiProperty({ required: false, description: 'Filter by part of title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, enum: ['general', 'promotion', 'event'] })
  @IsOptional()
  @IsEnum(['general', 'promotion', 'event'])
  category?: 'general' | 'promotion' | 'event';
}
