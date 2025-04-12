import { z } from 'zod';
import { TPriority, TStatus } from '@/api/boards/types';

export const TaskPriorityEnum = z.enum(['Low', 'Medium', 'High'])
export const TaskStatusEnum = z.enum(['Backlog', 'InProgress', 'Done'])

export const taskFormSchema = z.object({
    title: z
        .string({required_error: 'Название задачи обязательно'})
        .min(1, {message: 'Название задачи обязательно'})
        .max(100, {message: 'Название не может быть длиннее 100 символов'}),
    description: z
        .string()
        .min(1, {message: 'Описание должно быть больше 1 символа'})
        .max(500, {message: 'Описание не может быть больше 500 символов'}),
    boardId: z
        .string({required_error: 'Необходимо выбрать проект'}),
    priority: TaskPriorityEnum,
    status: TaskStatusEnum,
    assigneeId: z
        .string().optional(),
    id: z
        .number().optional(),
    boardName: z
        .string().optional(),

})

export type TaskFormData = z.infer<typeof taskFormSchema>