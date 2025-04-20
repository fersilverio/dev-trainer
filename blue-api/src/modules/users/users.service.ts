import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('NATS_SERVICE') private readonly nats: ClientProxy
  ) { }
  
  private async sendMessage(command: string, data: unknown) {
    const response = await firstValueFrom(this.nats.send({cmd: command}, data));
    return response;
  }
  
  
  async create(createUserDto: CreateUserDto) {
    const response = this.sendMessage('BLACKAPI.CREATEUSER', createUserDto);
    return response;
  }

  async findAll() {
    const response = this.sendMessage('BLACKAPI.FINDALLUSERS', "");
    return response;
  }

  async findOne(id: number) {
    const response = this.sendMessage('BLACKAPI.FINDONEUSER', id);
    return response;
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   const response = this.sendMessage(
  //     'BLACKAPI.UPDATEUSER', 
  //     {
  //       id, 
  //       data: updateUserDto
  //     }
  //   );
  //   return response;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
