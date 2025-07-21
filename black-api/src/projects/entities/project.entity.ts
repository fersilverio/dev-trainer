export class Project {
    id: number;
    code: string;
    name: string;
    niche: string | null;
    description: string | null;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
}
