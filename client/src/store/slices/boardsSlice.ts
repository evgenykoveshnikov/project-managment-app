import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardApi } from '@/api/boards';
import { IBoardInfo, IBoards, ITaskOnBoard } from '@/api/boards/types';

export const fetchBoards = createAsyncThunk('boards/fetchAll', async () => {
  const responce = await BoardApi.getAll();
  return responce.data.data;
});

export const fetchById = createAsyncThunk<
  { boardId: number; tasks: ITaskOnBoard[] },
  string
>('boards/fetchById', async (idString, { rejectWithValue }) => {
  const boardId = parseInt(idString, 10);
  if (isNaN(boardId)) {
    return rejectWithValue('Invalid Board ID format');
  }

  const responce = await BoardApi.getById(idString);
  return {
    boardId,
    tasks: responce.data.data,
  };
});

interface BoardsState {
  items: IBoards[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedBoard: {
    info: IBoardInfo | null;
    tasks: ITaskOnBoard[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
}

const initialState: BoardsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedBoard: {
    info: null,
    tasks: [],
    status: 'idle',
    error: null,
  },
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    clearSelectedBoard: (state) => {
      state.selectedBoard = initialState.selectedBoard;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchBoards.fulfilled,
        (state, action: PayloadAction<IBoards[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
        }
      )
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка загрузки';
      })
      .addCase(fetchById.pending, (state) => {
        state.selectedBoard.status = 'loading';
        state.selectedBoard.info = null;
        state.selectedBoard.tasks = [];
        state.selectedBoard.error = null;
      })
      .addCase(
        fetchById.fulfilled,
        (
          state,
          action: PayloadAction<{ boardId: number; tasks: ITaskOnBoard[] }>
        ) => {
          state.selectedBoard.status = 'succeeded';
          state.selectedBoard.tasks = action.payload.tasks;

          const boardInfoFromList = state.items.find(
            (b) => b.id === action.payload.boardId
          );
          if (boardInfoFromList) {
            state.selectedBoard.info = {
              id: boardInfoFromList.id,
              name: boardInfoFromList.name,
              description: boardInfoFromList.description,
            };
          } else {
            state.selectedBoard.info = {
              id: action.payload.boardId,
              name: 'Неизвестная доска',
              description: null,
            };
          }
          state.selectedBoard.error = null;
        }
      )
      .addCase(fetchById.rejected, (state, action) => {
        state.selectedBoard.status = 'failed';
        state.selectedBoard.error = action.error.message || 'Ошибка загрузи';
      });
  },
});

export const { clearSelectedBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
