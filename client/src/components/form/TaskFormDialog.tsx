import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '../ui/dialog'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'

import { Input } from "../ui/input";
import { Textarea } from '../ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

import  { Toaster } from '../ui/sonner';

import { taskFormSchema, TaskFormData, TaskPriorityEnum, TaskStatusEnum } from "./schemas/taskSchema";
import type { TaskDataForEdit, BoardListItem, AssigneeListItem } from "@/api/issues/types";

interface TaskFormDialogProps {
    children: React.ReactNode
    isOpen: boolean;
    onClose: () => void
    taskToEdit?: TaskDataForEdit | null 
    boardIdFromContext?: number | null
    availableBoards: BoardListItem[]
    availableAssignees: AssigneeListItem[]
    onSubmitForm: (data: TaskFormData, isEditing: boolean) => Promise<boolean>
    isLoading: boolean
}

export const TaskFormDialog = ({children, isOpen , onClose,  taskToEdit, boardIdFromContext, availableBoards, availableAssignees, onSubmitForm}: TaskFormDialogProps) => {
    const navigate = useNavigate()
    const sonner = Toaster
    const isEditing = !!taskToEdit
    const currentBoardId = isEditing ? taskToEdit.boardId : boardIdFromContext

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            id: taskToEdit?.id,
            title: taskToEdit?.title ?? '',
            description: taskToEdit?.description ?? '',
            boardId: currentBoardId ? String(currentBoardId) : undefined,
            priority: taskToEdit?.priority ?? TaskPriorityEnum.Enum.Medium,
            status: taskToEdit?.status ?? TaskStatusEnum.Enum.Backlog,
            assigneeId: taskToEdit?.assignee ? String(taskToEdit.assignee.id) : undefined,
        }
    })

    useEffect(() => {
        if (isOpen) {
            form.reset({
                id: taskToEdit?.id,
                title: taskToEdit?.title ?? '',
                description: taskToEdit?.description ?? '',
                boardId: currentBoardId ? String(currentBoardId) : undefined,
                priority: taskToEdit?.priority ?? TaskPriorityEnum.Enum.Medium,
                status: taskToEdit?.status ?? TaskStatusEnum.Enum.Backlog,
                assigneeId: taskToEdit?.assignee ? String(taskToEdit.assignee.id) : undefined,
            })
        }
    }, [taskToEdit, currentBoardId, isOpen, form])

    const handleFormSubmit = async (data: TaskFormData) => {
        console.log('Form Data Submitted:', data)

        const success = await onSubmitForm(data, isEditing)

        if (success) {
            onClose()
            sonner({
                title: 'Успех',
                description: `Задача успешно ${isEditing ? 'обновлена' : 'создана'}.`,
            })
        } else {
            sonner({
                title: 'Ошибка',
                description: `Не удалось ${isEditing ? 'обновить' : 'создать'} задачу.`,
                variant: 'destructive',
            })
        }
    }

    const handleGoToBoard = () => {
        if (taskToEdit?.boardId) {
            onClose()
            navigate(`/boards/${taskToEdit.boardId}`)
        }
    }

    const showGoToBoardButton = isEditing && !boardIdFromContext

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-slate-400">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Редактирование задачи' : 'Создание задачи'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Измените данные задачи' : 'Заполните информацию о новой задаче'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) =>(
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input  placeholder="Введите название задачи" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description"render={({ field }) => (
                            <FormItem>
                                <FormLabel>Описание</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Введите описание задачи" className="resize-none" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="boardId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Проект</FormLabel>
                                <Select 
                                onValueChange={field.onChange} 
                                defaultValue={taskToEdit?.boardName} 
                                value={field.value}
                                required={true}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите проект">
                                              {availableBoards.find(board => board.id === Number(field.value))?.name ?? taskToEdit?.boardName ?? 'Выберите проект'}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {availableBoards.map((board) => (
                        <SelectItem key={board.id} value={String(board.id)}>
                          {board.name}
                        </SelectItem>
                      ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Приоритет *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} required>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите приоритет" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TaskPriorityEnum.options.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority} {/* Используем значения Enum напрямую */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} required>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TaskStatusEnum.options.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Исполнитель</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите исполнителя (необязательно)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Опция "Не назначен" */}
                      <SelectItem value={'1'}>Не назначен</SelectItem>
                      {availableAssignees.map((assignee) => (
                        <SelectItem key={assignee.id} value={String(assignee.id)}>
                          {assignee.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-between pt-4">
                <div>
                    {showGoToBoardButton && (
                        <Button type="button" variant={'outline'} onClick={handleGoToBoard}>
                            перейти на доску
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant={'outline'}>
                            Отмена
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {isEditing ? 'Обновить' : 'Создать'}
                    </Button>
                </div>
            </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}