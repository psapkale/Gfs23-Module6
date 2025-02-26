import { createSlice } from "@reduxjs/toolkit";

const productsData = createSlice({
   name: "productsData",
   initialState: [],
   reducers: {
      setProductsData(state, action) {
         state = action.payload;
         return;
      },
   },
});

export default productsData.reducer;
export const { setProductsData } = productsData.actions;
