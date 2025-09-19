import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsQueryDto } from '../common/validator/news.query.validator';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../common/guards/role.guard';
import { UUIDValidationPipe } from '../common/validator/uuid-validation.pipe';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles(`Admin`)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() Dto: CreateNewsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.newsService.uploadFile(file);
      Dto.image = uploadResult?.data?.publicUrl;
    }
    return this.newsService.create(Dto);
  }

  @Get('/list')
  findAll(@Query() query: NewsQueryDto) {
    return this.newsService.findAll(query);
  }

  @Get('find/id/:id')
  findOne(@Param('id', new UUIDValidationPipe(4)) id: string) {
    return this.newsService.findOne(id);
  }

  @Roles(`Admin`)
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch('update/:id')
  update(
    @Param('id', new UUIDValidationPipe(4)) id: string,
    @Body() Dto: UpdateNewsDto,
  ) {
    return this.newsService.update(id, Dto);
  }

  @Roles(`Admin`)
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete('delete/:id')
  remove(@Param('id', new UUIDValidationPipe(4)) id: string) {
    return this.newsService.remove(id);
  }
}
