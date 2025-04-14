import { IAssigneeUserForTask, TPriority, TStatus } from '../boards/types';

export interface IGetTasks {
  assignee?: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  } | null;
  assigneeId: number | null;
  boardId: number;
  boardName: string;
  description: string | null;
  id: number;
  priority: TPriority;
  status: TStatus;
  title: string;
}

export interface TaskDataForEdit {
  id?: number;
  title: string;
  description: string | null;
  boardId: number; // должен быть передан извне
  boardName: string; // Приходит из API /tasks/{taskId}
  priority: TPriority;
  status: TStatus;
  assignee?: IAssigneeUserForTask | null;
}

export interface BoardListItem {
  id: number;
  name: string;
}

export interface AssigneeListItem {
  id: number;
  fullName: string;
}

export interface CreateTaskPayload {
  title: string;
  boardId: number;
  assigneeId: number;
  description: string | null;
  priority: TPriority;
}

export interface UpdateTaskPayload {
  title: string;
  assigneeId: number;
  description: string | null;
  priority: TPriority;
  status: TStatus;
}

export interface UpdateTaskStatusPayload {
  status: TStatus;
}

export interface IAssigneeUsers {
  avatarUrl: string;
  description: string;
  email: string;
  fullName: string;
  id: number;
  tasksCount: number;
  teamId: number;
  teamName: string;
}

export interface CreateTaskResponce {
  id: number;
}
export interface UpdateTaskResponce {
  messege: string;
}
export interface UpdateTaskStatusResponce {
  messege: string;
}
