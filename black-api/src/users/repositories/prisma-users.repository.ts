import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { UsersRepository } from "./users.repository";

export class PrismaUsersRepository implements UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserDto): Promise<User> {
        const newUser = await this.prisma.user.create({ data });
        return newUser;
    }
    // findOne(id: number): Promise<User> {
    //     throw new Error("Method not implemented.");
    // }
    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users;
    }
    // update(id: number, data: UpdateUserDto): Promise<User> {
    //     throw new Error("Method not implemented.");
    // }
    // delete(id: number): Promise<User> {
    //     throw new Error("Method not implemented.");
    // }

}