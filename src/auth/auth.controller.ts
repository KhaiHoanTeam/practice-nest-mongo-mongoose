import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from './decorators/user.decorators';
import { User as UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post(`/login`)
  async login(
    @Body() body: { username: string; password: string },
    @User() user: UserEntity,
  ) {
    return this.authService.login(user);
  }
}
