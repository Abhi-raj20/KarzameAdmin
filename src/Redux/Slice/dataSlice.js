import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allData: false,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    toggleData: (state, action) => {
      state.allData = action.payload;
    },
  },
});

export const { toggleData } = dataSlice.actions;

export default dataSlice.reducer;
