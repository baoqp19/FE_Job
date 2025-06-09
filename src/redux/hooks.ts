import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store";


// sử dụng thay useDispatch bằng useSelector 
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


/*
  // thay cho useDispatch và useSelecter để TS có thể sử dụng
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();
*/






