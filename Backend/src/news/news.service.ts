import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../database/entities/news.entity';
import { Repository } from 'typeorm';
import { SupabaseService } from '../database/supabase.service';
import { ConfigService } from '@nestjs/config';
import { NewsQueryDto } from '../common/validator/news.query.validator';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async create(Dto: CreateNewsDto) {
    const news = this.newsRepository.create(Dto);
    await this.newsRepository.save(news);
    return 'Creat News successfully';
  }

  async uploadFile(file: Express.Multer.File) {
    const supabase = this.supabaseService.getClient();
    const bucketName = this.configService.get<string>(
      'config.supabase.bucketNews',
    )!;

    const safeFileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(safeFileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new BadRequestException('Failed to download file');
    }

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(safeFileName);

    return { data: { publicUrl: data.publicUrl } };
  }

  async findAll(query: NewsQueryDto = {} as NewsQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    const qd = this.newsRepository.createQueryBuilder('news');

    if (query.id) {
      qd.andWhere('news.id = :id', { id: query.id });
    }

    if (query.title) {
      qd.andWhere('news.title ILIKE :title', { title: `%${query.title}%` });
    }

    if (query.category) {
      qd.andWhere('news.category = :category', { category: query.category });
    }

    if (query.sort) {
      qd.orderBy(
        `news.${query.sort}`,
        (query.order ?? 'ASC') as 'ASC' | 'DESC',
      );
    }

    qd.skip((page - 1) * limit).take(limit);

    const [entities, total] = await qd.getManyAndCount();

    return {
      page,
      pages: Math.ceil(total / limit),
      countItems: total,
      entities,
    };
  }

  async findOne(id: string) {
    const news = await this.newsRepository.findOne({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return news;
  }

  async update(id: string, Dto: UpdateNewsDto) {
    const news = await this.newsRepository.findOne({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    if (Dto.title) news.title = Dto.title;
    if (Dto.content) news.content = Dto.content;
    if (Dto.category) news.category = Dto.category;

    await this.newsRepository.save(news);
    return 'News updated successfully';
  }

  async remove(id: string) {
    const news = await this.newsRepository.findOne({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    const bucketName = this.configService.get<string>(
      'config.supabase.bucketNews',
    );

    if (!bucketName) {
      throw new Error('Supabase config values are missing');
    }

    if (news.image) {
      await this.supabaseService.removeFile(news.image, bucketName);
    }

    await this.newsRepository.delete(id);
    return { message: 'News successfully deleted' };
  }
}
