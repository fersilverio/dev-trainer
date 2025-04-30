import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CrewTechTeamService {
    constructor(
        @Inject('NATS_SERVICE') private readonly nats: ClientProxy
    ) { }

    async run(command: string, data: unknown) {
        const response = await firstValueFrom(this.nats.send({ cmd: command }, data));
        return response;
    }
}