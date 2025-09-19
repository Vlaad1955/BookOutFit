import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryDto } from '../common/validator/users.query.validator';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async findAll(query: UsersQueryDto = {} as UsersQueryDto) {
    const options = {
      page: Number(query.page ?? 1),
      limit: Number(query.limit ?? 10),
    };

    const filters: FindOptionsWhere<User> = {};
    const order: any = {};

    if (query.firstName) {
      filters.firstName = query.firstName;
    }

    if (query.lastName) {
      filters.lastName = query.lastName;
    }

    if (query.age) {
      filters.age = query.age;
    }

    if (query.phone) {
      filters.phone = query.phone;
    }

    if (query.email) {
      filters.email = query.email;
    }

    if (query.sort) {
      order[query.sort] = query.order ?? 'ASC';
    }

    const [entities, total] = await this.userRepository.findAndCount({
      where: filters,
      relations: ['comments', 'basket'],
      order: order,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    const usersWithoutPassword = plainToClass(User, entities, {
      excludeExtraneousValues: false,
    });

    return {
      page: options.page,
      pages: Math.ceil(total / options.limit),
      countItems: total,
      entities: usersWithoutPassword,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['comments', 'basket'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const usersWithoutPassword = plainToClass(User, user, {
      excludeExtraneousValues: false,
    });

    return usersWithoutPassword;
  }

  async roleUpdate(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'User') {
      user.role = 'Admin';
      await this.userRepository.save(user);
      return user;
    } else {
      throw new BadRequestException('The user is already an admin');
    }
  }

  async update(id: string, Dto: UpdateUserDto, userId: string) {
    const user = await this.findOne(id);

    if (user.id !== userId) {
      throw new ForbiddenException('Only the user can update his account');
    }

    if (Dto.firstName) user.firstName = Dto.firstName;
    if (Dto.lastName) user.lastName = Dto.lastName;
    if (Dto.age) user.age = Dto.age;
    if (Dto.phone) user.phone = Dto.phone;

    await this.userRepository.save(user);

    return 'Account updated successfully';
  }

  async remove(id: string, userId: string) {
    if (id !== userId) {
      throw new ForbiddenException('Only the user can delete his account');
    }

    return this.exclude(id);
  }

  async findOneTo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['comments', 'basket'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const usersWithoutPassword = plainToClass(User, user, {
      excludeExtraneousValues: false,
    });

    return usersWithoutPassword;
  }

  async exclude(id: string) {
    const user = await this.findOne(id);

    const defaultImageUrl = this.configService.get<string>(
      'config.supabase.defaultImageUrl',
    );
    const bucketName = this.configService.get<string>('config.supabase.bucket');

    if (!defaultImageUrl || !bucketName) {
      throw new Error('Supabase config values are missing');
    }

    if (user.image && user.image !== defaultImageUrl) {
      await this.supabaseService.removeFile(user.image, bucketName);
    }

    await this.userRepository.delete(id);

    return 'Account successfully deleted';
  }
}
