import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { NatsClientModule } from "src/infrastructure/nats-client/nats.module";

@Module({
    imports: [NatsClientModule],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {
} 