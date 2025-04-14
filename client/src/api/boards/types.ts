export interface IBoards {
  description: string | null;
  id: number;
  name: string;
  taskCount: number;
}

export interface IApiResponse<T> {
  data: T;
}

export interface IAssigneeUserForTask {
  avatarUrl: string | null;
  email: string;
  fullName: string;
  id: number;
}

export type TStatus = 'Backlog' | 'InProgress' | 'Done';
export type TPriority = 'Low' | 'Medium' | 'High';

export interface ITaskOnBoard {
  id: number;
  title: string;
  description: string | null;
  priority: TPriority;
  status: TStatus;
  assignee?: IAssigneeUserForTask;
}

export interface IBoardInfo {
  id: number;
  name: string;
  description: string | null;
}

export interface ITask {
  id: number;
  title: string;
  description: string | null;
  priority: TPriority;
  status: TStatus;
  assignee: IAssigneeUserForTask | null;
  assigneeId: number | null;
  boardId: number;
  boardName: string;
}
