import { Module } from "@nestjs/common";
import { NatsClientModule } from "src/insfrastructure/nats-client/nats.module";
import { CrewTechTeamService } from "./crew-tech-team.service";
import { CrewTechTeamController } from "./crew-tech-team.controller";

@Module({
    imports: [NatsClientModule],
    providers: [CrewTechTeamService],
    controllers: [CrewTechTeamController],
})
export class CrewTechTeamModule { }