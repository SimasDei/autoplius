import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { FindAllUsersDto } from './dtos/find-all-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id, 10));
  }

  @Get()
  findAllUsers(@Query('email') email: FindAllUsersDto['email']) {
    return this.usersService.find(email);
  }

  @Delete('/delete')
  deleteUser(@Body() body: DeleteUserDto) {
    return this.usersService.delete(body.id);
  }

  @Patch('/update')
  updateUser(@Body() body: UpdateUserDto) {
    return this.usersService.update(body.id, body);
  }
}
