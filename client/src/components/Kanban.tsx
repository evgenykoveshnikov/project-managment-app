import { ITaskOnBoard, TStatus } from '@/api/boards/types';
import { useEffect, useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { DragDropContext } from '@hello-pangea/dnd';
import { useAppDispatch } from '@/store/hooks';
import { updateTaskStatus } from '@/store/slices/issuesSlice';

export const Kanban = ({ tasksArr }: { tasksArr: ITaskOnBoard[] }) => {
  const [tasks, setTasks] = useState(tasksArr);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTasks(tasksArr);
  }, [tasksArr]);

  const moveTask = (taskId: number, newStatus: TStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const toDoTasks = tasks.filter((task) => task.status === 'Backlog');
  const inProgressTasks = tasks.filter((task) => task.status === 'InProgress');
  const doneTasks = tasks.filter((task) => task.status === 'Done');

  const onDragEnd = (result: boolean) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    const taskId = parseInt(result.draggableId);
    const newStatus = destination.droppableId as TStatus;
    moveTask(taskId, newStatus);

    dispatch(
      updateTaskStatus({
        id: taskId,
        data: {
          status: newStatus,
        },
      })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-grow overflow-y-auto min-h-0 gap-4">
        <KanbanColumn title="Backlog" tasks={toDoTasks} moveTask={moveTask} />
        <KanbanColumn
          title="InProgress"
          tasks={inProgressTasks}
          moveTask={moveTask}
        />
        <KanbanColumn title="Done" tasks={doneTasks} moveTask={moveTask} />
      </div>
    </DragDropContext>
  );
};
