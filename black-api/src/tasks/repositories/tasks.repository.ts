import { Features } from "nats/lib/nats-base-client/semver";
import { Feature, FeatureSet } from "../tasks.types";

export interface TasksRepository {
    save(featureSet: Feature[]);
}