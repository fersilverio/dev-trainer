import { Controller, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UsersMicroserviceController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern({ cmd: 'BLACKAPI.CREATEUSER' })
  create(@Payload() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (err) {
      throw new InternalServerErrorException("[BLACK-API] - Could not create new user.")
    }
  }

  @MessagePattern({cmd: 'BLACKAPI.FINDALLUSERS'})
  findAll() {
    try {
      return this.usersService.findAll();
    } catch (err) {
      throw new InternalServerErrorException("[BLACK-API] - Could not find users.")
    }
  }


  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }


  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }


  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
