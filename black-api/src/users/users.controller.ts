import { Controller, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UsersMicroserviceController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern({ cmd: 'createUser' })
  create(@Payload() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (err) {
      throw new InternalServerErrorException("[BLACK-API] - Could not create new user.")
    }
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }


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
