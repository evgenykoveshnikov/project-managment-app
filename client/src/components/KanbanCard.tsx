
import { Draggable } from "@hello-pangea/dnd";
import { ITask, TStatus } from "@/api/boards/types"


interface KanbanCardProps {
    task: ITask;
    index: number;
    moveTask: (taskId: number, newStatus: TStatus) => void
}


export const KanbanCard = ({ task, index, moveTask }: KanbanCardProps) => {
   
    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div className={`w-full mb-2 p-4 ${snapshot.isDragging ? "opacity-50" : "opacity-100"} transition-all`} ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
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