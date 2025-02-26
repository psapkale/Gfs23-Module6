import { createSlice } from "@reduxjs/toolkit";

const productsData = createSlice({
   name: "productsData",
   initialState: [],
   reducers: {
      setProductsData(state, action) {
         return (state = action.payload);
      },
   },
});

export default productsData.reducer;
export const { setProductsData } = productsData.actions;
