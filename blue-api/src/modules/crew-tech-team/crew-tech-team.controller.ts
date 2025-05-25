import { Controller, Get, InternalServerErrorException, Logger } from "@nestjs/common";
import { CrewTechTeamService } from "./crew-tech-team.service";

@Controller('tech-team')
export class CrewTechTeamController {
    private logger = new Logger(CrewTechTeamController.name);

    constructor(
        private readonly crewService: CrewTechTeamService,
    ) { }

    @Get('run')
    async runTechTeam() {
        try {
            const response = await this.crewService.run({});
            return response;
        } catch (error) {
            this.logger.error(`${error.message}\n${error.cause}`)
            throw error;
        }
    }
}