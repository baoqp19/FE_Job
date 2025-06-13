import { callFetchJob } from "@/config/api";
import type { IJob } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IJob[]
}
// First, create the thunk
export const fetchJob = createAsyncThunk(
    'job/fetchJob',
    async ({ query }: { query: string }) => {
        const response = await callFetchJob(query);
        return response;
    }
)


const initialState: IState = {
    isFetching: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
};


export const jobSlide = createSlice({
    name: 'job',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
        },


    },
    extraReducers: (builder) => {
        builder.addCase(fetchJob.pending, (state, action) => {
            state.isFetching = true;
        })

        builder.addCase(fetchJob.rejected, (state, action) => {
            state.isFetching = false;
        })

        builder.addCase(fetchJob.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
    },

});

export const {
    setActiveMenu,
} = jobSlide.actions;

export default jobSlide.reducer;
