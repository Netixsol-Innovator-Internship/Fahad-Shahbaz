import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { store } from "./store";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// optional helper if you later add slices with actions
export const useActions = (actions) => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
