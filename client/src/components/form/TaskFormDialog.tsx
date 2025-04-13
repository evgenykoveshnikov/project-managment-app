import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { setBoardLocked } from "@/store/slices/issuesSlice";

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
    const isEditing = !!taskToEdit
    boardIdFromContext = taskToEdit?.boardId ?? null
    const currentBoardId = isEditing ? taskToEdit.boardId : boardIdFromContext
    const isBoardLocked = useAppSelector(state => state.issues.isBoardLocked)
    const location = useLocation()

    const isTasksPage = location.pathname.includes('/issues');

    

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

    const { isDirty } = form.formState

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
    }, [taskToEdit, currentBoardId, isOpen])

    const handleFormSubmit = async (data: TaskFormData) => {
        console.log('TaskFormDialog handlerFormSubmit: Calling onSubmitForm...')
        let success = false;

        try {
          success = await onSubmitForm(data, isEditing)
          console.log('TaskFormDialog handleFormSubmit: onSubmitForm returned:', success)
        } catch (error) {
          console.error('ERROR during await', error)
          success = false
        }
         
        
        if (success) {
            console.log('TaskFormDialog handleFormSubmit: Success is true. Calling onClose()')
            onClose()
            
        } else {
            console.log('Success is false NOT calling onClose()')
        }
    }

    const handleGoToBoard = () => {
        if (taskToEdit?.boardId && taskToEdit.id) {
            onClose()
            navigate(`/boards/${taskToEdit.boardId}?openTask=${taskToEdit.id}`)
        }
    }

    const showGoToBoardButton = isEditing && isTasksPage;
    console.log('TaskFormDialog isOpen prop:', isOpen)
    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-slate-400 outline-0 border-0">
                <DialogHeader className="bg-amber-500">
                    <DialogTitle>{isEditing ? 'Редактирование задачи' : 'Создание задачи'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Измените данные задачи' : 'Заполните информацию о новой задаче'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) =>(
                            <FormItem>
                                <FormLabel>Название</FormLabel>
                                <FormControl>
                                    <Input  className={' ring-0 border-0 shadow-amber-400 focus:outline-amber-500 selection:bg-amber-400 focus-visible:ring-0'} placeholder="Введите название задачи" {...field} />
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
                                <FormLabel>Проект *</FormLabel>
                                <Select 
                                onValueChange={field.onChange} 
                                defaultValue={currentBoardId ? String(currentBoardId): undefined} 
                                value={field.value}
                                required={true}
                                disabled={isBoardLocked}>
                                    <FormControl>
                                        <SelectTrigger className="border-0 rounded-lg shadow-md transition-all active:ring-blue-400">
                                            <SelectValue placeholder="Выберите проект">
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white rounded-lg shadow-lg mt-1 overflow-hidden transition-all max-h-56 overflow-y-auto transform-3d">
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
                  <FormLabel>Исполнитель *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    required={true}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите исполнителя " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                        
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting || !isDirty}>
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