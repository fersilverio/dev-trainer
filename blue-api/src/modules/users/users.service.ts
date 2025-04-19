import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('NATS_SERVICE') private readonly nats: ClientProxy) { }
  
  async create(createUserDto: CreateUserDto) {
    const response = await firstValueFrom(this.nats.send({ cmd: 'createUser' }, createUserDto))
    return response;
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
