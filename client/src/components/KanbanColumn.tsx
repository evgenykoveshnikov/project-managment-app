import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { TStatus, ITaskOnBoard } from '@/api/boards/types';

interface KanbanColumnProps {
  title: string;
  tasks: ITaskOnBoard[];
  moveTask: (taskId: number, newStatus: TStatus) => void;
}

export const KanbanColumn = ({ title, tasks, moveTask }: KanbanColumnProps) => {
  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="p-4 flex flex-col gap-4 bg-gray-50 rounded-lg shadow-md overflow-y-auto "
        >
          <h2 className="font-bold text-lg mb-4">{title}</h2>
          {tasks.map((task, index) => (
            <KanbanCard
              key={task.id}
              task={task}
              index={index}
              moveTask={moveTask}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
