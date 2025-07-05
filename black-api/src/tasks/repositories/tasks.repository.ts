import { FeatureSet } from "../tasks.types";

export interface TasksRepository {
    save(featureSet: FeatureSet);
}