import { issuesApi } from "@/api/issues";
import { IGetTasks } from "@/api/issues/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchIssues = createAsyncThunk(
    'issues/fetchAll',
    async () => {
        const responce = await issuesApi.getAll();
        return responce.data.data;
    }
)

interface IssuesState {
    item: IGetTasks[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IssuesState = {
    item: [],
    status: 'idle',
    error: null,
};

const issuesSlice = createSlice({
    name: 'issues',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIssues.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchIssues.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.item = action.payload;
            })
            .addCase(fetchIssues.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Ошибка загрузки';
            })
    }
});

export default issuesSlice.reducer;