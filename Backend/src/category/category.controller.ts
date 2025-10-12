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
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  ReturnCategoryDto,
} from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from '../common/validator/category.query.validator';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../common/guards/role.guard';
import { UUIDValidationPipe } from '../common/validator/uuid-validation.pipe';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(`Admin`)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post('/')
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ReturnCategoryDto> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('/')
  findAll(@Query() query: CategoryQueryDto) {
    return this.categoryService.findAll(query);
  }

  @Get(`/mainCategories`)
  findMainCategories() {
    return this.categoryService.findMainCategories();
  }

  @Get('find/:id')
  findOne(@Param('id', new UUIDValidationPipe(4)) id: string) {
    return this.categoryService.findOne(id);
  }

  @Roles(`Admin`)
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch(':id')
  update(
    @Param('id', new UUIDValidationPipe(4)) id: string,
    @Body() Dto: UpdateCategoryDto,
  ): Promise<string> {
    return this.categoryService.update(id, Dto);
  }

  @Roles(`Admin`)
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete(':id')
  remove(@Param('id', new UUIDValidationPipe(4)) id: string): Promise<string> {
    return this.categoryService.remove(id);
  }
}
