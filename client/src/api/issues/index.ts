import { IApiResponse } from '../boards/types';
import { apiClient } from '../client';
import {
  CreateTaskPayload,
  CreateTaskResponce,
  IAssigneeUsers,
  IGetTasks,
  UpdateTaskPayload,
  UpdateTaskResponce,
  UpdateTaskStatusPayload,
  UpdateTaskStatusResponce,
} from './types';

export const issuesApi = {
  getAll: () => apiClient.get<IApiResponse<IGetTasks[]>>('/tasks'),
  getById: (id: number) =>
    apiClient.get<IApiResponse<IGetTasks>>(`/tasks/${id}`),
  createTask: (data: CreateTaskPayload) =>
    apiClient.post<IApiResponse<CreateTaskResponce>>('/tasks/create', data),
  updateTask: (id: number, data: UpdateTaskPayload) =>
    apiClient.put<IApiResponse<UpdateTaskResponce>>(
      `/tasks/update/${id}`,
      data
    ),
  updateTaskStatus: (id: number, data: UpdateTaskStatusPayload) =>
    apiClient.put<IApiResponse<UpdateTaskStatusResponce>>(
      `/tasks/updateStatus/${id}`,
      data
    ),
  getAssignees: () => apiClient.get<IApiResponse<IAssigneeUsers[]>>('/users'),
};
