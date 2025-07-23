import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class ReorderKanbanColumnDto {

    @IsNumber()
    @IsNotEmpty()
    columnId: number;

    @IsNotEmpty()
    @IsNumber({}, { each: true })
    @IsArray()
    newOrderArray: number[];
}