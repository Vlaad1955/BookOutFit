import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ReturnUserDto {
  @IsOptional()
  @IsUUID('4', { message: 'Id must be a valid UUID v4' })
  @ApiProperty({
    required: false,
    type: String,
    format: 'uuid',
    description: 'Unique identifier (UUID v4)',
  })
  id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  lastName?: string;

  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  @Min(6, { message: 'Age must be at least 6' })
  @Max(99, { message: 'Age must not exceed 99' })
  @ApiProperty({ required: false, type: Number })
  age?: number;

  @IsOptional()
  @IsString()
  @Matches(/^(\+380|0)\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, {
    message:
      'Phone must be a valid Ukrainian number, e.g. +380501234567 or 050 123 45 67',
  })
  @ApiProperty({
    required: false,
    type: String,
    example: '+380501234567',
    description:
      'Phone number in Ukrainian format, supports +380 or 0, spaces or dashes',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  image?: string;
}

export class CreateUserDto extends ReturnUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  @Transform(({ value }) => value.trim().toLowerCase())
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one number, and one special character',
    },
  )
  @ApiProperty({ required: true })
  password: string;
}

export class TokenDto {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;
}

export class ResetDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  @Transform(({ value }) => value.trim().toLowerCase())
  @MaxLength(20, { message: 'Email must not exceed 20 characters' })
  email: string;
}

export class PasswordDto {
  @IsString()
  @IsNotEmpty()
  lostPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one number, and one special character',
    },
  )
  @ApiProperty({ required: true })
  newPassword: string;
}
