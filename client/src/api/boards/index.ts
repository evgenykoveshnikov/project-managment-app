import { apiClient } from "../client";
import { IApiResponse, IBoards, ITask } from "./types";

export const BoardApi = {
    getAll: () => apiClient.get<IApiResponse<IBoards[]>>('/boards'),
    getById: (id: string) => apiClient.get<IApiResponse<ITask>>(`/boards/${id}`)
}