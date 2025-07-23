import { CreateKanbanColumnDto } from "../dtos/create-kanban-column.dto";
import { ReorderKanbanColumnDto } from "../dtos/reorder-kanban-column.dto";
import { Feature, KanbanBoardRegistry } from "../tasks.types";

export interface TasksRepository {
    saveTasks(featureSet: Feature[]);
    saveKanbanColumn(data: CreateKanbanColumnDto);
    saveKanbanBoard();
    getProjectColumnDefinitions(): Promise<KanbanBoardRegistry[]>;
    reorderKanbanColumn(data: ReorderKanbanColumnDto): Promise<void>;
}