import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './slices/boardsSlice';
import issuesReducer from './slices/issuesSlice';


export const store = configureStore({
    reducer: {
        boards: boardsReducer,
        issues: issuesReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;