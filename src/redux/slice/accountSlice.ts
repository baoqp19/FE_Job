import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



// viet 3 trạng thái cho extraReducer 
export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await axios.get('/api/v1/auth/account')
        return response.data
    }
)


interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    errorRefreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id?: string;
            name?: string;
            permissions?: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    };
    activeMenu: string;
}


const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        userId: "",
        email: "",
        phone: "",
        _id: "",
        role: "",
    },
    activeMenu: 'home'

}

export const accountSlice = createSlice({
    name: "account",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true,
                    state.isLoading = false,

                    state.user.email = action.payload.email
                state.user.phone = action.payload.phone
                state.user._id = action.payload._id
                state.user.role = action.payload.role

            }
        })
    },
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },

        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true,
                state.isLoading = false;
            state.user = {
                ...state.user = action.payload
            }
        },

        setLogoutAction: (state, action) => {
            localStorage.removeItem("access_token");
            state.isAuthenticated = false;
            state.user = {
                userId: "",
                email: "",
                phone: "",
                _id: "",
                role: "",
            }
        }
    },
});

export const {
    setActiveMenu, setUserLoginInfo, setLogoutAction
} = accountSlice.actions;

export default accountSlice.reducer   // lấy mỗi reducer 