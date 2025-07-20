import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { FeatureSet } from "./crew-tech-team.types";
import { NatsService } from "src/infrastructure/nats-client/nats.service";

@Injectable()
export class CrewTechTeamService {
	constructor(
		private readonly natsService: NatsService,
	) { }

	async run(data: unknown): Promise<FeatureSet> {
		const response = await this.natsService.sendMessage("tech.team.kickoff", data);

		if (response.status !== 200) {
			throw new InternalServerErrorException(response.error, { cause: response.details })
		}

		await this.persistAtBlackApi(response.features);

		return response.features;
	}

	private async persistAtBlackApi(features: FeatureSet) {
		const response = await this.natsService.sendMessage('BLACKAPI.SAVE.TASK.STRUCTURE', features);

		if (response.status !== 201) {
			throw new InternalServerErrorException(response.error, { cause: response.details });
		}
		return response;
	}
}