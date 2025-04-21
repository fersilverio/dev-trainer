import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { UsersRepository } from "./users.repository";
import { NotFoundException } from "@nestjs/common";

export class PrismaUsersRepository implements UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserDto): Promise<User> {
        const newUser = await this.prisma.user.create({ data });
        return newUser;
    }

    async findOne(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({where: {id}});

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users;
    }
    
    async update(data: {id: number, data: UpdateUserDto}): Promise<User> {
        const updatedUser = await this.prisma.user.update(
            {
                where: {
                    id: data.id
                }, 
                data: {
                    ...data,
                }
            }
        );
        return updatedUser;
    }

    // delete(id: number): Promise<User> {
    //     throw new Error("Method not implemented.");
    // }

}