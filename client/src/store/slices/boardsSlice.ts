import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BoardApi } from "@/api/boards";
import { IApiResponse, IAssigneeUserForTask, IBoards, ITask } from "@/api/boards/types";

export const fetchBoards = createAsyncThunk(
    'boards/fetchAll',
    async () => {
        const responce = await BoardApi.getAll();
        return responce.data.data;
    }
);

export const fetchById = createAsyncThunk(
    'boards/fetchById',
    async (id: string) => {
        const responce = await BoardApi.getById(id);
        return responce.data.data;
    }
)

interface BoardsState {
    item: IBoards[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    selectedBoard: ITask[] | null;
    name: string;
}

const initialState: BoardsState = {
    item: [],
    status: 'idle',
    error: null,
    selectedBoard: null,
    name: '',
};

const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoards.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBoards.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.item = action.payload;
            })
            .addCase(fetchBoards.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Ошибка загрузки';
            })
            .addCase(fetchById.pending, (state) => {
                state.status = 'loading';
                state.selectedBoard = null;
            })
            .addCase(fetchById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedBoard = action.payload;
            })
            .addCase(fetchById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Ошибка загрузки'
            })
    }
});

export default boardsSlice.reducer;