import { callFetchAllSkill } from "@/config/api";
import type { ISkill } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



interface IState {
    isFetching: boolean;
    meta: {
        page: number,
        pageSize: number,
        pages: number,
        total: number,
    },
    result: ISkill[],
}

const initialState: IState = {
    isFetching: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    },
    result: []
}

export const fetchSkill = createAsyncThunk(
    'skill/fetchSkill',
    async ({ query }: { query: string }) => {
        const response = await callFetchAllSkill(query);
        return response;
    }
)

export const skillSlide = createSlice({
    name: 'skill',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
        },


    },
    extraReducers: (builder) => {
        builder.addCase(fetchSkill.pending, (state, action) => {
            state.isFetching = true;
        })

        builder.addCase(fetchSkill.rejected, (state, action) => {
            state.isFetching = false;
        })

        builder.addCase(fetchSkill.fulfilled, (state, action) => {
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
} = skillSlide.actions;

export default skillSlide.reducer;

