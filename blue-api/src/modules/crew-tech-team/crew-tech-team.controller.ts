import { Controller, Get } from "@nestjs/common";
import { CrewTechTeamService } from "./crew-tech-team.service";

@Controller('tech-team')
export class CrewTechTeamController {
    constructor(
        private readonly crewService: CrewTechTeamService,
    ) { }

    @Get('run')
    async runTechTeam() {
        return await this.crewService.run({})
    }
}