import { Draggable } from '@hello-pangea/dnd';
import { ITaskOnBoard, TStatus } from '@/api/boards/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { TaskDataForEdit } from '@/api/issues/types';
import { openEditTaskDialog, setBoardLocked } from '@/store/slices/issuesSlice';
import { useParams } from 'react-router-dom';
import { fetchBoards } from '@/store/slices/boardsSlice';

interface KanbanCardProps {
  task: ITaskOnBoard;
  index: number;
  moveTask: (taskId: number, newStatus: TStatus) => void;
}

export const KanbanCard = ({ task, index }: KanbanCardProps) => {
  const dispatch = useAppDispatch();
  const { items: board } = useAppSelector((state) => state.boards);
  const { id } = useParams();

  const handleOpenTask = () => {
    const boardId = id;
    dispatch(fetchBoards());
    const boardname = board.find((board) => board.id === Number(boardId))?.name;

    const taskToEdit: TaskDataForEdit = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignee: task.assignee,
      boardId: Number(boardId),
      boardName: String(boardname),
    };

    dispatch(openEditTaskDialog(taskToEdit));
    dispatch(setBoardLocked(true));
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          onClick={handleOpenTask}
          className={` border-1 rounded-md shadow-lg border-slate-300 cursor-pointer w-full mb-2 p-4 ${snapshot.isDragging ? 'opacity-30' : 'opacity-100'} transition-all`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h3 className="font-semibold mb-2">
            {task.title} | <span className="font-normal">{task.priority}</span>
          </h3>
          <p className="mb-2">{task.description}</p>
          <p>{task.assignee?.fullName}</p>
        </div>
      )}
    </Draggable>
  );
};
