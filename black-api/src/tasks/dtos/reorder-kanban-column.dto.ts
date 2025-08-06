export class ReorderKanbanColumnDto {
    columnId: number;
    newOrderArray: { kanbanRegistryId: number, taskId: number }[];
}