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

export interface ITask {
    id: number;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Backlog' | 'InProgress' | 'Done';
    assignee?: IAssigneeUserForTask[]
}