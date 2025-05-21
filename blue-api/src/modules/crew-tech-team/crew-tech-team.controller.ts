import { Controller, Get, InternalServerErrorException } from "@nestjs/common";
import { CrewTechTeamService } from "./crew-tech-team.service";

@Controller('tech-team')
export class CrewTechTeamController {
    constructor(
        private readonly crewService: CrewTechTeamService,
    ) { }

    @Get('run')
    async runTechTeam() {
        try {
            return await this.crewService.run({})
        } catch (error) {
            throw new InternalServerErrorException("Deu ruim com a crew")
        }
    }
}