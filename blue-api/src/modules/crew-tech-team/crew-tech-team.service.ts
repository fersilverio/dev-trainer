import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CrewTechTeamService {
    constructor(
        @Inject('NATS_SERVICE') private readonly nats: ClientProxy
    ) { }

    async run(data: unknown) {
        console.log("cheguei aqui")
        const response = await firstValueFrom(this.nats.send("tech.team.kickoff", data));
        return response;
    }
}