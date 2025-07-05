export type FeatureSet = {
    features: Feature[]
};

export type Feature = {
    title: string;
    tasks: FeatureTask[];
};

export type FeatureTask = {
    title: string;
    priority: number;
    deadline: string;
    deliverable_explanation: string;
    technical_backend_description: string;
    technical_frontend_description: string;
};