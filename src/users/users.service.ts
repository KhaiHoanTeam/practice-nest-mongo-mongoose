import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { HashService } from 'src/auth/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private hashService: HashService,
  ) {}

  async getUserByUsername(username: string) {
    return await this.userModel
      .findOne({
        username,
      })
      .exec();
  }

  async registerUser(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);

    const user = await this.getUserByUsername(createdUser.username);
    if (user) {
      throw new BadRequestException();
    }

    createdUser.password = await this.hashService.hashPassword(
      createdUser.password,
    );

    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { ...updateUserDto })
      .exec();
    return updatedUser;
  }

  async remove(id: string) {
    const deletedCat = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedCat;
  }
}
