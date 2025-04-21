import { Controller, Post, Body, Inject, Logger, HttpException, HttpStatus, Get, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,

  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (err) {
      if (err instanceof HttpException) {
        this.logger.error(err.message);
        throw err;
      } else {
        throw new HttpException('User could not be created.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
