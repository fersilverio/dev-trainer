import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  @Inject("UsersRepository")
  private usersRepository: UsersRepository;

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  // async update(data: {id: number, updateUserDto: UpdateUserDto}) {
  //   console.log("black service")
  //   console.log(data.id, data.updateUserDto);
  //   return this.usersRepository.update(data.id, data.updateUserDto);
  // }


  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
