import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NatsService } from 'src/infrastructure/nats-client/nats.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly natsService: NatsService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const response = this.natsService.sendMessage('BLACKAPI.CREATEUSER', createUserDto);
    return response;
  }

  async findAll() {
    const response = this.natsService.sendMessage('BLACKAPI.FINDALLUSERS', "");
    return response;
  }

  async findOne(id: number) {
    const response = this.natsService.sendMessage('BLACKAPI.FINDONEUSER', id);
    return response;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const dataObj = {
      id,
      ...updateUserDto
    }
    const response = this.natsService.sendMessage(
      'BLACKAPI.UPDATEUSER',
      dataObj
    );
    return response;
  }

  async remove(id: number) {
    const response = this.natsService.sendMessage('BLACKAPI.REMOVEUSER', id);
    return response;
  }
}
