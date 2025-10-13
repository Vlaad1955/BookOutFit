import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from '../common/validator/users.query.validator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorator/user.decorator';
import { Roles } from '../common/decorator/roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { UUIDValidationPipe } from '../common/validator/uuid-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  findAll(@Query() query: UsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @UseGuards(AuthGuard())
  @Get('find')
  findOneToToken(@User('id') userId: string) {
    return this.usersService.findOneTo(userId);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id', new UUIDValidationPipe(4)) id: string,
    @Body() Dto: UpdateUserDto,
    @User('id') userId: string,
  ) {
    return this.usersService.update(id, Dto, userId);
  }

  @Roles('Admin')
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch('role/:id')
  updateRole(@Param('id', new UUIDValidationPipe(4)) id: string) {
    return this.usersService.roleUpdate(id);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(
    @Param('id', new UUIDValidationPipe(4)) id: string,
    @User('id') userId: string,
  ) {
    return this.usersService.remove(id, userId);
  }

  @Roles('Admin')
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete('exclude/:id')
  exclude(@Param('id', new UUIDValidationPipe(4)) id: string) {
    return this.usersService.exclude(id);
  }
}
