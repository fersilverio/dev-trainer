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

export type KanbanColumn = {
    id: number;
    title: string;
    cards: any[];
};

export type KanbanCard = {
    id: number;
    title: string;
    description: string;
    userResponsible: string;
    priority: number;
    deadline: Date;
};

export type KanbanColumnRegistry = {
    id: number;
    name: string;
    position: number;
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
};

export type KanbanBoardRegistry = {
    id: number;
    projectId: number;
    taskId: number;
    columnId: number;
    orderAtColumn: number;
    createdAt: Date;
};
