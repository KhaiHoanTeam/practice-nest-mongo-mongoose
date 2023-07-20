import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { User as UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByUsername(username);
    if (
      user &&
      (await this.hashService.comparePassword(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: UserEntity) {
    const payload = {
      username: user.username,
      sub: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
