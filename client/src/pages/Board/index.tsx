import { TaskDataForEdit } from '@/api/issues/types';
import { Kanban } from '@/components/Kanban';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBoards, fetchById } from '@/store/slices/boardsSlice';
import { getUsers, openEditTaskDialog } from '@/store/slices/issuesSlice';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export const BoardPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { selectedBoard, items: allBoards } = useAppSelector(
    (state) => state.boards
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const taskId = searchParams.get('openTask');
  const boardMeta = allBoards.find((board) => board.id === Number(id))?.name;

  useEffect(() => {
    if (id) {
      dispatch(fetchById(id));
      dispatch(fetchBoards());
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (taskId && selectedBoard && selectedBoard.tasks) {
      const taskToEdit = selectedBoard.tasks.find(
        (task) => task.id === Number(taskId)
      );

      if (taskToEdit) {
        const taskData: TaskDataForEdit = {
          id: taskToEdit.id,
          title: taskToEdit.title,
          description: taskToEdit.description,
          priority: taskToEdit.priority,
          status: taskToEdit.status,
          assignee: taskToEdit.assignee,
          boardId: Number(id),
          boardName: boardMeta || '',
        };

        dispatch(openEditTaskDialog(taskData));
        setSearchParams({}); // Открываем модальное окно
      }
    }
  }, [taskId, dispatch, selectedBoard, boardMeta, id, setSearchParams]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-xl px-4 py-2 font-semibold">{boardMeta}</h1>
      <Kanban tasksArr={selectedBoard.tasks || []}></Kanban>
    </div>
  );
};
