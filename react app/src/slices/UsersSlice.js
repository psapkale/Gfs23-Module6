import { createSlice } from "@reduxjs/toolkit";

const usersData = createSlice({
   name: "usersData",
   initialState: [],
   reducers: {
      setUsersData(state, action) {
         state = action.payload;
         return;
      },
   },
});

export default usersData.reducer;
export const { setUsersData } = usersData.actions;
