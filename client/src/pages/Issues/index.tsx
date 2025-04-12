import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createTask, fetchIssues, updateTask } from "@/store/slices/issuesSlice";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { BoardListItem, CreateTaskPayload, TaskDataForEdit, UpdateTaskPayload } from "@/api/issues/types";
import { fetchBoards } from "@/store/slices/boardsSlice";
import { TaskFormData } from "@/components/form/schemas/taskSchema";
import { create } from "domain";
import { ITask } from "@/api/boards/types";
import { TaskFormDialog } from "@/components/form/TaskFormDialog";

export const IssuesPage = () => {
    const { items: tasks, status: tasksStatus } = useAppSelector((state) => state.issues)
    const {items: boards, status: boardsStatus } = useAppSelector((state) => state.boards)
    const { assignees, assigneesStatus } = useAppSelector((state) => state.issues);
    const dispatch = useAppDispatch()
    const { toast } = Toaster

    const [taskToEdit, setTaskToEdit] = useState<TaskDataForEdit | null>(null);
    const isSubmittingForm = tasksStatus === 'loading'

    


    useEffect(() => {
        if (tasksStatus === 'idle') {
            dispatch(fetchIssues())
        }

        if (boardsStatus === 'idle') {
            dispatch(fetchBoards())
        }
    }, [dispatch, boardsStatus])


    const handleTaskSubmit = async (formData: TaskFormData, isEditing: boolean): Promise<boolean> => {
        console.log('я срабатываю')
        let resultAction;

        if(isEditing && formData.id) {
            const payload: UpdateTaskPayload = {
                title: formData.title,
                assigneeId: formData.assigneeId ? parseInt(formData.assigneeId, 10) : 0,
                description: formData.description || null,
                priority: formData.priority,
                status: formData.status,
            }
            resultAction = await dispatch(updateTask({ id: formData.id, data: payload}));
        } else {
            
            const payload: CreateTaskPayload = {
                title: formData.title,
                boardId: parseInt(formData.boardId, 10),
                assigneeId: formData.assigneeId ? parseInt(formData.assigneeId, 10) : 0,
                description: formData.description || null,
                priority: formData.priority
            }
            resultAction = await dispatch(createTask(payload))
        }

        if(updateTask.fulfilled.match(resultAction) || createTask.fulfilled.match(resultAction)) {
            setTaskToEdit(null);
            dispatch(fetchIssues())
            toast({
                title: 'успех',
                description: `Задача успешно ${isEditing ? 'обновлена' : 'создана'}. Список будет обновлен.` 
            })
            return true;
        } else {
            const errorMessage = (resultAction.payload as string) || `Не удалось ${isEditing ? 'обновить' : 'создать'} задачу`;
            toast({ title: 'Ошибка', description: errorMessage, variant: 'destructive' });
            return false;
        }
    }

    const openEditDialog = (task: ITask) => {
        if (task.boardId === undefined || task.boardName === undefined) {
            console.error("Task object is missing boardId or boardName:", task);
             toast({ title: 'Ошибка', description: 'Недостаточно данных для редактирования задачи.', variant: 'destructive' });
             return;
        }

        const taskForEditing: TaskDataForEdit = {
            id: task.id,
            title: task.title,
            description: task.description,
            boardId: task.boardId,
            boardName: task.boardName,
            priority: task.priority,
            status: task.status,
            assignee: task.assignee
        }

        setTaskToEdit(taskForEditing);
        console.log(taskForEditing)
    }

    

    const boardListItem: BoardListItem[] = boards.map(b => ({id:b.id, name:b.name}));

    

    return (
       <div className="h-[calc(100vh-80px)] flex flex-col px-4 py-2 gap-4"> {/* Адаптируйте высоту */}
             {/* ... Заголовок, Фильтры ... */}

             <ScrollArea className="flex-grow h-0 min-h-0 mb-2 pr-4">
                {tasks.map((task) => (
                    <Card key={task.id} className="mb-2 cursor-pointer" onClick={() => openEditDialog(task)}>
                        <CardHeader>
                            <CardTitle>{task.title}</CardTitle>
                            <CardDescription>{task.boardName}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
             </ScrollArea>
            <TaskFormDialog 
                isOpen={taskToEdit !== null}
                onClose={() => setTaskToEdit(null)}
                taskToEdit={taskToEdit}
                availableAssignees={assignees}
                availableBoards={boardListItem}
                onSubmitForm={handleTaskSubmit}
                isLoading={isSubmittingForm}>
            <></>
            </TaskFormDialog> 
        </div>
    )
};