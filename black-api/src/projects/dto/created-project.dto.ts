export class CreatedProjectDto {
    id: number;
    code: string;
    name: string;
    niche: string | null;
    description: string | null;
    owner: {
        id: number;
        name: string;
    };
    createdAt: Date;
    updatedAt?: Date;
}