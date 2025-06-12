import { configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlice";
import companyReducer from "./slice/companySlide";

export const store = configureStore({
    reducer: {
        account: accountReducer,
        company: companyReducer
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
