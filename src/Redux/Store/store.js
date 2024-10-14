import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../Slice/dataSlice";

const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

export default store;
