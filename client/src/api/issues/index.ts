import { IApiResponse } from "../boards/types";
import { apiClient } from "../client";
import { IGetTasks } from "./types";

export const issuesApi = {
    getAll: () => apiClient.get<IApiResponse<IGetTasks>>('/tasks')
}