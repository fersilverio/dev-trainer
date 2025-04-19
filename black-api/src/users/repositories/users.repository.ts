import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity"

export interface UsersRepository {
    create(data: CreateUserDto): Promise<User>;
    // findOne(id: number): Promise<User>;
    // findAll(): Promise<User[]>;
    // update(id: number, data: UpdateUserDto): Promise<User>;
    // delete(id: number): Promise<User>;
}