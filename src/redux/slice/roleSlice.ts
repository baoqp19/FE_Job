import { callFetchRole, callFetchRoleById } from "@/config/api";
import type { IRole } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IRole[];
    isFetchSingle: boolean;
    singleRole: IRole;
}

const initialState: IState = {
    isFetching: true,
    isFetchSingle: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    },
    result: [],
    singleRole: {
        id: "",
        name: "",
        description: "",
        active: false,
        permissions: []
    }
};

export const fetchRole = createAsyncThunk(
    "resume/fetchRole",
    async ({ query }: { query: string }) => {
        const response = await callFetchRole(query);
        return response;
    }
)


export const fetchRoleById = createAsyncThunk(
    "resume/fetchRoleById",
    async (id: string) => {
        const response = await callFetchRoleById(id);
        return response;
    }
)

export const roleSilce = createSlice({
    name: "role",
    initialState,
    reducers: {
        resetSingleRole: (state, action) => {
            state.singleRole = {
                id: "",
                name: "",
                description: "",
                active: false,
                permissions: []
            }
        }
    },

    extraReducers: (builder) => {
        builder.addCase(fetchRole.pending, (state, action) => {
            state.isFetching = true;
        })


        builder.addCase(fetchRole.rejected, (state, action) => {
            state.isFetching = false;
        })

        builder.addCase(fetchRole.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })

        builder.addCase(fetchRoleById.pending, (state, action) => {
            state.isFetchSingle = true;
            state.singleRole = {
                id: "",
                name: "",
                description: "",
                active: false,
                permissions: [],
            }
        })

        builder.addCase(fetchRoleById.rejected, (state, action) => {
            state.isFetchSingle = false;
            state.singleRole = {
                id: "",
                name: "",
                description: "",
                active: false,
                permissions: []
            }
        })

        builder.addCase(fetchRoleById.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetchSingle = false;
                state.singleRole = action.payload.data;
            }
        })
    }
})

export const { resetSingleRole } = roleSilce.actions;

export default roleSilce.reducer