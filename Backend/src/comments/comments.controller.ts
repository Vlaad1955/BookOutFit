import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';
import { Comment } from '../database/entities/comment.entity';
import { CommentQueryDto } from '../common/validator/comment.query.validator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorator/user.decorator';
import { UUIDValidationPipe } from '../common/validator/uuid-validation.pipe';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard())
  @Post('/create-comment')
  async create(
    @Body() Dto: CreateCommentDto,
    @User('id') userId: string,
  ): Promise<Comment> {
    return this.commentsService.create(Dto, userId);
  }

  @Get('/list')
  findAll(@Query() query: CommentQueryDto) {
    return this.commentsService.findAll(query);
  }

  @Get('find/:id')
  findOne(
    @Param('id', new UUIDValidationPipe(4)) id: string,
  ): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch('update/:id')
  async update(
    @Param('id', new UUIDValidationPipe(4)) id: string,
    @Body() Dto: UpdateCommentDto,
    @User('id') userId: string,
  ): Promise<string> {
    return this.commentsService.update(id, Dto, userId);
  }

  @UseGuards(AuthGuard())
  @Delete('delete/:id')
  async remove(
    @Param('id', new UUIDValidationPipe(4)) id: string,
    @User('id') userId: string,
  ): Promise<string> {
    return this.commentsService.remove(id, userId);
  }
}
