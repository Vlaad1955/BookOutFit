import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorator/user.decorator';
import {UUIDValidationPipe} from "../common/validator/uuid-validation.pipe";

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @UseGuards(AuthGuard())
  @Post('add')
  create(@Body() Dto: CreateBasketDto, @User('id') userId: string) {
    return this.basketService.create(Dto, userId);
  }

  @UseGuards(AuthGuard())
  @Delete('remove/:id')
  remove(@Param('id', new UUIDValidationPipe(4)) id: string, @User('id') userId: string) {
    return this.basketService.remove(id, userId);
  }

  @UseGuards(AuthGuard())
  @Delete('clear')
  clear(@User('id') userId: string) {
    return this.basketService.clear(userId);
  }

  @UseGuards(AuthGuard())
  @Get('find')
  findAll(@User('id') userId: string) {
    return this.basketService.getUserBasket(userId);
  }
}
