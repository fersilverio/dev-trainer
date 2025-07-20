import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class NatsService {
    constructor(
        @Inject('NATS_SERVICE') private readonly nats: ClientProxy
    ) { }

    async sendMessage(command: string, data: unknown) {
        const response = await firstValueFrom(this.nats.send(command, data));
        return response;
    }
}