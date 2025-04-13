
import { Draggable } from "@hello-pangea/dnd";
import { ITask, TStatus } from "@/api/boards/types"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { TaskDataForEdit } from "@/api/issues/types";
import { openEditTaskDialog, setBoardLocked, updateTaskStatus } from "@/store/slices/issuesSlice";
import { useParams } from "react-router-dom";



interface KanbanCardProps {
    task: ITask;
    index: number;
    moveTask: (taskId: number, newStatus: TStatus) => void
}


export const KanbanCard = ({ task, index, moveTask }: KanbanCardProps) => {
    const dispatch = useAppDispatch();
    const { id } = useParams()

    const handleOpenTask = () => {
        const boardId = id
        

        const taskToEdit: TaskDataForEdit = {
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            assignee: task.assignee,
            boardId: Number(boardId),
            boardName: task.boardName   
        };

        dispatch(openEditTaskDialog(taskToEdit))
        dispatch(setBoardLocked(true));
    }

    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div onClick={handleOpenTask} className={` cursor-pointer w-full mb-2 p-4 ${snapshot.isDragging ? "opacity-50" : "opacity-100"} transition-all`} ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                    <h3 className="font-semibold">
                        {task.title}
                    </h3>
                    <p>
                        {task.description}
                    </p>
                </div>
            )}
        </Draggable>
    )
}