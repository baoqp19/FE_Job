import { configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlice";
import companyReducer from "./slice/companySlide";
import userReducer from "./slice/userSlice";
import jobReducer from "./slice/jobSlice";
import skillReducer from "./slice/skillSlice";
import resumeReducer from "./slice/resumeSlice";
import permissionReducer from "./slice/permissionSlice";
import roleReducer from "./slice/roleSlice";
export const store = configureStore({
    reducer: {
        account: accountReducer,
        company: companyReducer,
        user: userReducer,
        job: jobReducer,
        skill: skillReducer,
        resume: resumeReducer,
        permission: permissionReducer,
        role: roleReducer,
    },
});


export type AppDispatch = typeof store.dispatch;   // Điều này giúp TypeScript hiểu được các action được dispatch trong ứng dụng.
export type RootState = ReturnType<typeof store.getState>; // Đây là kiểu dữ liệu cho toàn bộ state của ứng dụng.
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType, // void 
    RootState, // State cho toàn bộ ứng dụng 
    unknown,
    Action<string> // kiểu action cơ bản của redux 
>;
