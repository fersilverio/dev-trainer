import { CreateKanbanColumnDto } from "../dtos/create-kanban-column.dto";
import { ReorderKanbanColumnDto } from "../dtos/reorder-kanban-column.dto";
import { Feature, KanbanBoardRegistry, KanbanColumn, TasksFromProjectInfo } from "../tasks.types";

export interface TasksRepository {
    saveTasks(featureSet: Feature[]);
    saveKanbanColumn(data: CreateKanbanColumnDto);
    getInfoAboutProjectTasks(projectId: number): Promise<TasksFromProjectInfo | undefined>;
    saveKanbanBoard();
    getProjectColumnDefinitions(): Promise<{ filledColumnsDefinitions: KanbanBoardRegistry[], emptyColumns: KanbanColumn[] }>;
    reorderKanbanColumn(data: ReorderKanbanColumnDto): Promise<void>;
}