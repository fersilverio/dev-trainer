import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ReorderKanbanColumnDto {

    @IsString()
    @IsNotEmpty()
    columnId: string;

    @IsNotEmpty()
    @IsArray()
    newOrderArray: { kanbanRegistryId: number, taskId: number }[];
}