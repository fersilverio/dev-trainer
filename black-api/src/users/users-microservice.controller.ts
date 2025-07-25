import { Controller, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersMicroserviceController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern('BLACKAPI.CREATEUSER')
  create(@Payload() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (err) {
      throw new InternalServerErrorException("[BLACK-API] - Could not create new user.")
    }
  }

  @MessagePattern('BLACKAPI.FINDALLUSERS')
  findAll() {
    try {
      return this.usersService.findAll();
    } catch (err) {
      throw new InternalServerErrorException("[BLACK-API] - Could not find users.");
    }
  }

  @MessagePattern('BLACKAPI.FINDONEUSER')
  findOne(@Payload() id: number) {
    try {
      return this.usersService.findOne(id);
    } catch (err) {
      throw new InternalServerErrorException(`[BLACK-API] - Could not find user with id ${id}.`);
    }
  }

  @MessagePattern('BLACKAPI.UPDATEUSER')
  update(@Payload() data: { id: number, data: UpdateUserDto }) {
    try {
      return this.usersService.update(data);
    } catch (err) {
      throw new InternalServerErrorException(`[BLACK-API] - Could not update user with id ${data.id}`);
    }
  }

  @MessagePattern('BLACKAPI.REMOVEUSER')
  remove(@Payload() id: string) {
    return this.usersService.remove(+id);
  }
}
