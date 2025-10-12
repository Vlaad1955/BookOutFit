import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  Headers,
  UseGuards,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginDto,
  PasswordDto,
  ResetDto,
  TokenDto,
} from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() Dto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<TokenDto, 'refreshToken'>> {
    if (file) {
      const uploadResult = await this.authService.uploadFile(file);
      Dto.image =
        uploadResult?.data?.publicUrl ||
        'https://ziqxesyaovpowhccmwiw.supabase.co/storage/v1/object/public/user-covers/Empty_avatar.jpg';
    }

    const { accessToken, refreshToken } =
      await this.authService.signUpUser(Dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('/login')
  @HttpCode(200)
  async singInUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<TokenDto, 'refreshToken'>> {
    const { accessToken, refreshToken } =
      await this.authService.signInUser(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @UseGuards(AuthGuard())
  @Post(`/logout`)
  async logOutUser(
    @Headers() headers: Record<string, string>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const authHeader = headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    res.clearCookie('refreshToken');
    return this.authService.logOutUser(authHeader);
  }

  @Post(`/refresh`)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<TokenDto, 'refreshToken'>> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Patch('resetPassword')
  async resetPassword(@Body() dto: ResetDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(AuthGuard())
  @Patch('newPassword')
  async newPassword(
    @Body() dto: PasswordDto,
    @Headers() headers: Record<string, string>,
  ): Promise<{ message: string }> {
    const authHeader = headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    return this.authService.passwordUpdate(dto, authHeader);
  }
}
