import { callFetchCompany } from "@/config/api";
import type { ICompany } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface IState {
    isFetching: boolean;
    meta: {
        page: number,
        pageSize: number,
        pages: number,
        total: number,
    }
    result: ICompany[]
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
};


export const fetchCompany = createAsyncThunk(
    'company/fetchCompany',
    async ({ query }: { query: string }) => {
        const response = await callFetchCompany(query)
        console.log(response.data)
        return response;
    }
)


export const companySlide = createSlice({
    name: "company",
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            // state.activeMenu = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCompany.pending, (state, action) => {
            state.isFetching = true;
        })

        builder.addCase(fetchCompany.rejected, (state, action) => {
            state.isFetching = false;
        })

        builder.addCase(fetchCompany.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
    }
})

export const { setActiveMenu } = companySlide.actions

export default companySlide.reducer;

