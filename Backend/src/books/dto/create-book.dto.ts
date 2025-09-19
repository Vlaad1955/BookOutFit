import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum CoverType {
  SOFT = 'soft',
  FIRM = 'firm',
}

class CategoryDto {
  @IsUUID('4')
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1, { message: 'The price must be greater than 0' })
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  gift: boolean;

  @IsEnum(CoverType)
  @IsNotEmpty()
  cover: CoverType;

  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  categories: string[];
}
