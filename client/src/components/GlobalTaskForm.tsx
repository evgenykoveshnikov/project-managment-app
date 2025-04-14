import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeTaskDialog } from '@/store/slices/issuesSlice';
import { TaskFormDialog } from '@/components/form/TaskFormDialog';
import { createTask, updateTask } from '@/store/slices/issuesSlice';
import { UpdateTaskPayload, CreateTaskPayload } from '@/api/issues/types';
import { fetchIssues } from '@/store/slices/issuesSlice';
import { TaskFormData } from './form/schemas/taskSchema';

export const GlobalTaskForm = () => {
  const dispatch = useAppDispatch();

  const { isTaskDialogOpen, taskToEdit, assignees } = useAppSelector(
    (state) => state.issues
  );
  const isSubmittingForm = useAppSelector(
    (state) => state.issues.status === 'loading'
  );
  const boards = useAppSelector((state) => state.boards.items);

  const handleTaskSubmit = async (
    formData: TaskFormData,
    isEditing: boolean
  ) => {
    let resultAction;
    if (isEditing && formData.id) {
      const payload: UpdateTaskPayload = {
        title: formData.title,
        assigneeId: Number(formData.assigneeId),
        description: formData.description || null,
        priority: formData.priority,
        status: formData.status,
      };
      resultAction = await dispatch(
        updateTask({ id: formData.id, data: payload })
      );
    } else {
      const payload: CreateTaskPayload = {
        title: formData.title,
        boardId: Number(formData.boardId),
        assigneeId: Number(formData.assigneeId),
        description: formData.description || null,
        priority: formData.priority,
      };

      resultAction = await dispatch(createTask(payload));
    }

    if (createTask.fulfilled.match(resultAction)) {
      dispatch(fetchIssues());
      return true;
    } else if (updateTask.fulfilled.match(resultAction)) {
      dispatch(fetchIssues());
      return true;
    } else {
      return false;
    }
  };

  return (
    <TaskFormDialog
      isOpen={isTaskDialogOpen}
      onClose={() => dispatch(closeTaskDialog())}
      taskToEdit={taskToEdit}
      availableAssignees={assignees}
      availableBoards={boards}
      onSubmitForm={handleTaskSubmit}
      isLoading={isSubmittingForm}
    >
      <></>
    </TaskFormDialog>
  );
};
