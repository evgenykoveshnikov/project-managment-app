import { IAssigneeUserForTask } from "../boards/types";

export interface IGetTasks {
    assignee?: IAssigneeUserForTask[],
    assigneeId: number;
    boardId: number;
    boardName: string;
    description: string;
    id: number;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Backlog' | 'InProgress' | 'Done';
    title: string
}