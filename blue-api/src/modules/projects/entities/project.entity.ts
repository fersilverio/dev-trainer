export class Project {
    id: number;
    code: string;
    name: string;
    niche?: string;
    description?: string;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
}
