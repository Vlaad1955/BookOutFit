import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorator/user.decorator';
import { BookQueryDto } from '../common/validator/books.query.validator';
import { UUIDValidationPipe } from '../common/validator/uuid-validation.pipe';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(AuthGuard())
  @Post(':bookId')
  likeBook(
    @Param('bookId', new UUIDValidationPipe(4)) bookId: string,
    @User('id') userId: string,
  ) {
    return this.likesService.likeBook(userId, bookId);
  }

  @UseGuards(AuthGuard())
  @Delete(':bookId')
  unlikeBook(
    @Param('bookId', new UUIDValidationPipe(4)) bookId: string,
    @User('id') userId: string,
  ) {
    return this.likesService.unlikeBook(userId, bookId);
  }

  @UseGuards(AuthGuard())
  @Get('/list')
  getLikedBooks(@User('id') userId: string, @Query() query: BookQueryDto) {
    return this.likesService.getLikedBooks(userId, query);
  }

  @Get('count/:bookId')
  getLikesCount(@Param('bookId', new UUIDValidationPipe(4)) bookId: string) {
    return this.likesService.getLikesCount(bookId);
  }
}
