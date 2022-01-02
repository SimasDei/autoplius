import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Param,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindAllUsersDto } from './dtos/find-all-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id, 10));
  }

  @Get()
  findAllUsers(@Query('email') email: FindAllUsersDto['email']) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(parseInt(id, 10));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id, 10), body);
  }
}
