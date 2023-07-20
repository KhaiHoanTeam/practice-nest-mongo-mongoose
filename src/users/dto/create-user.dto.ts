import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}
