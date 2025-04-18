import { IAssigneeUsers, TaskDataForEdit } from './../../api/issues/types';
import { TStatus, ITask, IAssigneeUserForTask } from '@/api/boards/types';
import { issuesApi } from '@/api/issues';
import {
  CreateTaskPayload,
  IGetTasks,
  UpdateTaskPayload,
  UpdateTaskStatusPayload,
} from '@/api/issues/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const fetchIssues = createAsyncThunk('issues/fetchAll', async () => {
  const responce = await issuesApi.getAll();
  return responce.data.data;
});

export const createTask = createAsyncThunk<
  { id: number; sentData: CreateTaskPayload },
  CreateTaskPayload,
  { rejectValue: string }
>('issues/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await issuesApi.createTask(taskData);
    if (
      response.data &&
      response.data.data &&
      typeof response.data.data.id === 'number'
    ) {
      return { id: response.data.data.id, sentData: taskData };
    }

    throw new Error('некоретный ответ от сервера');
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        'Ошибка создания задачи'
    );
  }
});

export const updateTask = createAsyncThunk<
  { id: number; sentData: UpdateTaskPayload },
  { id: number; data: UpdateTaskPayload }
>('issues/updateTask', async ({ id, data }) => {
  await issuesApi.updateTask(id, data);
  return {
    id,
    sentData: data,
  };
});

export const updateTaskStatus = createAsyncThunk<
  { id: number; status: TStatus },
  { id: number; data: UpdateTaskStatusPayload }
>('issues/updateTaskStatus', async ({ id, data }) => {
  await issuesApi.updateTaskStatus(id, data);
  return {
    id,
    status: data.status,
  };
});

export const getUsers = createAsyncThunk('issues/getAllUsers', async () => {
  const response = await issuesApi.getAssignees();
  return response.data.data;
});

interface IssuesState {
  items: ITask[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  assignees: IAssigneeUsers[];
  assigneesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  assigneesError: string | null;
  isTaskDialogOpen: boolean;
  taskToEdit: TaskDataForEdit | null;
  isBoardLocked: boolean;
}

const initialState: IssuesState = {
  items: [],
  status: 'idle',
  error: null,
  assignees: [],
  assigneesStatus: 'idle',
  assigneesError: null,
  isTaskDialogOpen: false,
  taskToEdit: null as TaskDataForEdit | null,
  isBoardLocked: false,
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    openCreateTaskDialog(state) {
      state.isTaskDialogOpen = true;
      state.taskToEdit = null;
    },
    openEditTaskDialog(state, action: PayloadAction<TaskDataForEdit | null>) {
      state.isTaskDialogOpen = true;
      state.taskToEdit = action.payload;
      state.isBoardLocked = false;
    },
    closeTaskDialog(state) {
      state.isTaskDialogOpen = false;
      state.taskToEdit = null;
    },
    setBoardLocked(state, action: PayloadAction<boolean>) {
      state.isBoardLocked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchIssues.fulfilled,
        (state, action: PayloadAction<IGetTasks[]>) => {
          state.status = 'succeeded';
          state.items = action.payload.map((issue) => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
            status: issue.status,
            assigneeId: issue.assigneeId,
            boardId: issue.boardId,
            boardName: issue.boardName,
            assignee: issue.assignee
              ? ({
                  id: issue.assignee.id,
                  fullName: issue.assignee.fullName,
                  email: issue.assignee.email,
                  avatarUrl: issue.assignee.avatarUrl,
                } as IAssigneeUserForTask)
              : null,
          }));
          state.error = null;
        }
      )
      .addCase(fetchIssues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.error as string) || 'Ошибка загрузки';
      })
      .addCase(createTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTask.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTask.fulfilled, (state /* action */) => {
        state.status = 'idle'; // Сбрасываем статус для refetch
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // updateTaskStatus
      .addCase(updateTaskStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateTaskStatus.fulfilled,
        (state, action: PayloadAction<{ id: number; status: TStatus }>) => {
          const index = state.items.findIndex(
            (task) => task.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index].status = action.payload.status; // Обновляем только статус
          }
          state.status = 'succeeded'; // Можно вернуть succeeded, т.к. операция проще
          state.error = null;
        }
      )
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getUsers.pending, (state) => {
        state.assigneesStatus = 'loading';
        state.assigneesError = null;
      })
      .addCase(
        getUsers.fulfilled,
        (state, action: PayloadAction<IAssigneeUsers[]>) => {
          state.assigneesStatus = 'succeeded';
          state.assignees = action.payload;
          state.assigneesError = null;
        }
      )
      .addCase(getUsers.rejected, (state, action) => {
        state.assigneesStatus = 'failed';
        state.assigneesError =
          action.error.message ?? 'Ошибка загрузки исполнителей';
      });
  },
});

export const {
  openCreateTaskDialog,
  openEditTaskDialog,
  closeTaskDialog,
  setBoardLocked,
} = issuesSlice.actions;
export default issuesSlice.reducer;
