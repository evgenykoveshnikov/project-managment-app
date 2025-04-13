import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeTaskDialog } from "@/store/slices/issuesSlice";
import { TaskFormDialog } from "@/components/form/TaskFormDialog";
import { createTask, updateTask } from "@/store/slices/issuesSlice";
import { UpdateTaskPayload, CreateTaskPayload } from "@/api/issues/types";
import { fetchIssues } from "@/store/slices/issuesSlice";

export const GlobalTaskForm = () => {
    const dispatch = useAppDispatch();

    const { isTaskDialogOpen, taskToEdit, assignees } = useAppSelector(state => state.issues);
    const isSubmittingForm = useAppSelector(state => state.issues.status === 'loading');
    const boards = useAppSelector(state => state.boards.items);

    const handleTaskSubmit = async (formData: TaskFormData, isEditing: boolean) => {
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
                    console.log('handleTaskSubmit: Update Action Result:', resultAction)
                } else {
                    
                    const payload: CreateTaskPayload = {
                        title: formData.title,
                        boardId: Number(formData.boardId),
                        assigneeId: Number(formData.assigneeId),
                        description: formData.description || null,
                        priority: formData.priority
                    }
                    console.log('handleTaskSubmit: Dispatchin createTask with payload:', payload)
                    resultAction = await dispatch(createTask(payload))
                    console.log('handleTaskSubmit: Create Acion Result:', JSON.stringify(resultAction, null, 2))
                }
        
                if(createTask.fulfilled.match(resultAction)) {
                    console.log('handleTaskSubmit: createTask fulfilled MATCHED. Returning true');
                    dispatch(fetchIssues())
                    return true;
                } else if (updateTask.fulfilled.match(resultAction)) {
                    console.log('handleTaskSubmit: updateTask fulfilled MATCHED. Returning true')
                    dispatch(fetchIssues())
                    return true;
                } else {
                    console.log('handleTaskSubmit: Action did NOT match fulfilled. Returning false')
                    return false;
                }
    }

    return (
        <TaskFormDialog
            isOpen={isTaskDialogOpen}
            onClose={() => dispatch(closeTaskDialog())}
            taskToEdit={taskToEdit}
            availableAssignees={assignees}
            availableBoards={boards}
            onSubmitForm={handleTaskSubmit}
            isLoading={isSubmittingForm}>
                <>
                </>
            </TaskFormDialog>
    )
}