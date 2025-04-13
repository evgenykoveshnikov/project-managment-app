import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeTaskDialog, createTask, fetchIssues, getUsers, openEditTaskDialog, updateTask } from "@/store/slices/issuesSlice";
import { useMemo , useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { BoardListItem, CreateTaskPayload, TaskDataForEdit, UpdateTaskPayload } from "@/api/issues/types";
import { fetchBoards } from "@/store/slices/boardsSlice";
import { TaskFormData, TaskStatusEnum } from "@/components/form/schemas/taskSchema";
import { ITask } from "@/api/boards/types";
import { TaskFormDialog } from "@/components/form/TaskFormDialog";
import { SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Select, SelectItem } from '../../components/ui/select'

export const IssuesPage = () => {
    const { items: tasks, status: tasksStatus, isTaskDialogOpen, taskToEdit } = useAppSelector((state) => state.issues)
    const {items: boards, status: boardsStatus } = useAppSelector((state) => state.boards)
    const { assignees, assigneesStatus } = useAppSelector((state) => state.issues);
    const dispatch = useAppDispatch()
    const isSubmittingForm = tasksStatus === 'loading'

    const [statusFilter, setStatusFilter] = useState<string>('')
    const [boardFilter, setBoardFilter] = useState<string>('')
    const [titleSearch, setTitleSearch] = useState<string>('')
    const [assigneeSearch, setAssigneeSerach] = useState<string>('')

    const statusOptions = [...TaskStatusEnum.options]

    
    const resolveBoardId = (task: ITask) => {
        if (task.boardId === 0) {
            return boards.find(board => board.name === task.boardName)?.id
        }
    }

    useEffect(() => {
        if (tasksStatus === 'idle') {
            dispatch(fetchIssues())
        }

        if (boardsStatus === 'idle') {
            dispatch(fetchBoards())
        }

        if (assigneesStatus === 'idle') {
            dispatch(getUsers())
        }
    }, [dispatch, boardsStatus, assigneesStatus])


    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (statusFilter && task.status !== statusFilter) {
                return false;
            }

            const numericBoardFilter = boardFilter ? parseInt(boardFilter, 10) : null;
            const taskBoardId = resolveBoardId(task);
            if (numericBoardFilter !== null && taskBoardId !== numericBoardFilter) {
                console.log(taskBoardId)
                if(taskBoardId === undefined) console.warn(`Could not determine boardId ${task.id}`)
                return false;
            }

            if (titleSearch && !task.title.toLowerCase().includes(titleSearch.toLowerCase())) {
                return false;
            }

            if (assigneeSearch && !task.assignee?.fullName.toLowerCase().includes(assigneeSearch.toLowerCase())) {
                if(!task.assignee) return false
                
                return false;
            }

            return true;
        })
    }, [tasks, statusFilter, boardFilter, titleSearch, assigneeSearch, boards])


    const openCreateDialog = () => {
        dispatch(openEditTaskDialog(null))
    }


    const openEditDialog = (task: ITask) => {
        const correctedBoardId = Number(resolveBoardId(task))
        console.log(correctedBoardId)

        const taskForEditing: TaskDataForEdit = {
            id: task.id,
            title: task.title,
            description: task.description,
            boardId: correctedBoardId,
            boardName: task.boardName,
            priority: task.priority,
            status: task.status,
            assignee: task.assignee
        }

        dispatch(openEditTaskDialog(taskForEditing))
        }

    

    const boardListItem: BoardListItem[] = boards.map(b => ({id:b.id, name:b.name}));

    

    return (
    <div>
        <div className="flex flex-wrap gap-4 mb-4 px-4">
            <Input placeholder="Поиск по названи..." value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} className="max-w-sm bg-gray-600"/>
            <Input placeholder="Поиск по исполнителю..." value={assigneeSearch} onChange={(e) => setAssigneeSerach(e.target.value)} className="max-w-sm"/>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-amber-700">
                    <SelectValue placeholder='Фильтр по статусу'/>
                </SelectTrigger>
                <SelectContent className="bg-amber-600 rounded-3xl shadow-sm">
                    {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={boardFilter} onValueChange={setBoardFilter}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Фильтр по доске'/>
                    </SelectTrigger>
                    <SelectContent className="bg-amber-700 z-10">
                        {boardListItem.map((board) => (
                            <SelectItem key={board.id} value={String(board.id)}>
                                {board.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
            </Select>
        </div>
        <div className="h-[calc(100vh-80px)] flex flex-col px-4 py-2 gap-4"> {/* Адаптируйте высоту */}
             {/* ... Заголовок, Фильтры ... */}

             <ScrollArea className="flex-grow h-0 min-h-0 mb-2 pr-4">
                {filteredTasks.map((task) => (
                    <Card key={task.id} className="mb-2 cursor-pointer" onClick={() => openEditDialog(task)}>
                        <CardHeader>
                            <CardTitle>{task.title}</CardTitle>
                            <CardDescription>{task.boardName}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
             </ScrollArea> 
        </div>
        <div className="flex justify-end flex-shrink-0 pt-4 border-t">
                        <Button size={"lg"} onClick={openCreateDialog}>
                            {isSubmittingForm ? 'Загрузка...' : 'Создать задачу'}
                        </Button>
        </div>
        
    </div>
       
    )
};