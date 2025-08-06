import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class ReorderKanbanColumnDto {

    @IsNumber()
    @IsNotEmpty()
    columnId: number;

    @IsNotEmpty()
    @IsArray()
    newOrderArray: { kanbanRegistryId: number, taskId: number }[];
}