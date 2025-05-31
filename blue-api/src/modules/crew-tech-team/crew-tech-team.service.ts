import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CrewTechTeamService {
    constructor(
        @Inject('NATS_SERVICE') private readonly nats: ClientProxy
    ) { }

    async run(data: unknown): Promise<{ features: Array<any> }> {
        const response = await firstValueFrom(this.nats.send("tech.team.kickoff", data));

        if (response.status !== 200) {
            throw new InternalServerErrorException(response.error, { cause: response.details })
        }
        return response.features;
    }
}