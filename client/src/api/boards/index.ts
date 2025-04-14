import { apiClient } from '../client';
import { IApiResponse, IBoards, ITaskOnBoard } from './types';

export const BoardApi = {
  getAll: () => apiClient.get<IApiResponse<IBoards[]>>('/boards'),
  getById: (id: string) =>
    apiClient.get<IApiResponse<ITaskOnBoard[]>>(`/boards/${id}`),
};
