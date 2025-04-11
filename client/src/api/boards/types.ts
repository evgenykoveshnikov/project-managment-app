export interface IBoards {
    description: string;
    id: number;
    name: string;
    taskCount: number
}

export interface IApiResponse<T> {
    data: T,
}

export interface IAssigneeUserForTask {
    avatarUrl: string;
    email: string;
    fullName: string;
    id: number;
}

export type TStatus = 'Backlog' | 'InProgress' | 'Done'

export interface ITask {
    id: number;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: TStatus;
    assignee?: IAssigneeUserForTask[]
}