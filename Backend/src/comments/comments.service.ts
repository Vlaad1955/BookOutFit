import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Comment } from '../database/entities/comment.entity';
import { User } from '../database/entities/user.entity';
import { Book } from '../database/entities/book.entity';
import { CommentQueryDto } from '../common/validator/comment.query.validator';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(Dto: CreateCommentDto, userId: string) {
    const book = await this.bookRepository.findOne({
      where: { id: Dto.book_id },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentRepository.create({
      text: Dto.text,
      book,
      user,
    });

    try {
      const savedComment = await this.commentRepository.save(comment);
      return savedComment;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create comment');
    }
  }

  async findAll(query: CommentQueryDto = {} as CommentQueryDto) {
    const options = {
      page: Number(query.page ?? 1),
      limit: Number(query.limit ?? 10),
    };

    const filters: FindOptionsWhere<Comment> = {};
    const order: any = {};

    if (query.sort) {
      order[query.sort] = query.order ?? 'ASC';
    }

    if (query.book_id) {
      filters.book = { id: query.book_id };
    }

    if (query.user_id) {
      filters.user = { id: query.user_id };
    }

    const [entities, total] = await this.commentRepository.findAndCount({
      where: filters,
      relations: ['book', 'user'],
      order: order,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    return {
      page: options.page,
      pages: Math.ceil(total / options.limit),
      countItems: total,
      entities,
    };
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['book', 'user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, Dto: UpdateCommentDto, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['book', 'user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment?.user.id !== userId) {
      throw new UnauthorizedException('Only the user can update his comment');
    }

    comment.text = Dto.text;
    await this.commentRepository.save(comment);

    return 'Comment updated successfully';
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['book', 'user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment?.user.id !== userId) {
      throw new UnauthorizedException('Only the user can delete his comment');
    }

    await this.commentRepository.delete(id);

    return 'Comment deleted successfully';
  }
}
