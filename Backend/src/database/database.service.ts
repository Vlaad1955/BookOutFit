import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import * as path from 'path';
import * as process from 'process';
import { Category } from './entities/category.entity';
import { Book } from './entities/book.entity';
import { Comment } from './entities/comment.entity';
import { Basket } from './entities/basket.entity';
import { BasketItem } from './entities/basket.item.entity';
import { News } from './entities/news.entity';
import { LikedBook } from './entities/like.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const postgresUrl = this.configService.get<string>('config.databaseUrl');
    return {
      type: 'postgres',
      url: postgresUrl,
      ssl: { rejectUnauthorized: false },
      entities: [
        User,
        Category,
        Book,
        Comment,
        Basket,
        BasketItem,
        News,
        LikedBook,
      ],
      migrations: [
        path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
      ],
      synchronize: true,
    };
  }
}
