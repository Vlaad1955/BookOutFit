import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto, UpdatePublishedDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../database/entities/book.entity';
import { Brackets, In, Repository } from 'typeorm';
import { SupabaseService } from '../database/supabase.service';
import { ConfigService } from '@nestjs/config';
import { Category } from '../database/entities/category.entity';
import { BookQueryDto } from '../common/validator/books.query.validator';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async create(Dto: CreateBookDto) {
    const categories = await this.categoryRepository.find({
      where: { id: In(Dto.categories) },
    });

    if (categories.length !== Dto.categories.length) {
      throw new BadRequestException('Some categories were not found');
    }

    const book = this.bookRepository.create({
      ...Dto,
      categories: categories,
    });
    this.bookRepository.save(book);
    return 'Creat book successfully';
  }

  async uploadFile(file: Express.Multer.File) {
    const supabase = this.supabaseService.getClient();
    const bucketName = this.configService.get<string>(
      'config.supabase.bucketBook',
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

  async update(id: string, Dto: UpdateBookDto) {
    const book = await this.findOne(id);

    if (Dto.categories) {
      const categories = await this.categoryRepository.find({
        where: { id: In(Dto.categories) },
      });

      book.categories = categories;
    }

    if (Dto.title) book.title = Dto.title;
    if (Dto.price) book.price = Dto.price;
    if (Dto.description) book.description = Dto.description;
    if (Dto.author) book.author = Dto.author;
    if (Dto.gift !== undefined) book.gift = Dto.gift;
    if (Dto.cover) book.cover = Dto.cover;
    if (Dto.image) book.image = Dto.image;

    await this.bookRepository.save(book);
    return 'Book updated successfully';
  }

  async published(id: string, Dto: UpdatePublishedDto) {
    const book = await this.findOne(id);

    book.published = Dto.published;
    await this.bookRepository.save(book);
    return `Book published successfully`;
  }

  async findAll(query: BookQueryDto = {} as BookQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    const qb = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.categories', 'category')
      .leftJoinAndSelect('book.comments', 'comment')

    if (query.price) {
      qb.andWhere('book.price BETWEEN :min AND :max', {
        min: query.price.min,
        max: query.price.max,
      });
    }

    if (query.author?.length) {
      qb.andWhere(
        new Brackets((qb1) => {
          (query.author || []).forEach((author, i) => {
            qb1.orWhere(`book.author ILIKE :author${i}`, {
              [`author${i}`]: `%${author}%`,
            });
          });
        }),
      );
    }

    if (query.cover) {
      qb.andWhere('book.cover = :cover', { cover: query.cover });
    }

    if (query.title) {
      qb.andWhere('book.title ILIKE :title', { title: `%${query.title}%` });
    }

    if (query.search) {
      qb.andWhere('book.title ILIKE :search', { search: `%${query.search}%` });
    }

    if (query.gift !== undefined) {
      qb.andWhere('book.gift = :gift', { gift: query.gift });
    }

    if (query.id) {
      qb.where('book.id = :id', { id: query.id });
    } else {
      qb.where('book.published = :published', {
        published: query.published ?? true,
      });
    }

    if (query.categories) {
      const categoryIds = Array.isArray(query.categories)
        ? query.categories
        : [query.categories];
      qb.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    if (query.sort) {
      qb.orderBy(
        `book.${query.sort}`,
        (query.order ?? 'ASC') as 'ASC' | 'DESC',
      );
    }

    qb.skip((page - 1) * limit).take(limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      page,
      pages: Math.ceil(total / limit),
      countItems: total,
      entities,
    };
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
      relations: ['categories'],
    });

    if (!book) {
      throw new UnauthorizedException('Book not found');
    }

    return book;
  }

  async remove(id: string) {
    await this.deleteFile(id);
    await this.bookRepository.delete(id);
    return 'Book successfully deleted';
  }

  async deleteFile(id: string) {
    const book = await this.findOne(id);

    const defaultImageUrl = this.configService.get<string>(
      'config.supabase.defaultImageUrlBook',
    );
    const bucketName = this.configService.get<string>(
      'config.supabase.bucketBook',
    );

    if (!defaultImageUrl || !bucketName) {
      throw new Error('Supabase config values are missing');
    }

    if (book.image && book.image !== defaultImageUrl) {
      await this.supabaseService.removeFile(book.image, bucketName);
    }
  }

  async getMaxPrice(query: BookQueryDto = {} as BookQueryDto): Promise<number> {
    const qb = this.bookRepository
      .createQueryBuilder('book')
      .select('MAX(book.price)', 'maxPrice')
      .where('book.published = :published', {
        published: query.published ?? true,
      });

    if (query.categories) {
      const categoryIds = Array.isArray(query.categories)
        ? query.categories
        : [query.categories];
      qb.leftJoin('book.categories', 'category');
      qb.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    const result = await qb.getRawOne<{ maxPrice: string }>();
    return Number(result?.maxPrice) || 0;
  }

  async getAllAuthors(
    query: BookQueryDto = {} as BookQueryDto,
  ): Promise<string[]> {
    const qb = this.bookRepository
      .createQueryBuilder('book')
      .select('DISTINCT book.author', 'author')
      .where('book.published = :published', {
        published: query.published ?? true,
      });

    if (query.categories?.length) {
      qb.leftJoin('book.categories', 'category');
      qb.andWhere('category.id IN (:...categoryIds)', {
        categoryIds: query.categories,
      });
    }

    const results = await qb.getRawMany<{ author: string }>();

    return results
      .map((row) => row.author)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }
}
