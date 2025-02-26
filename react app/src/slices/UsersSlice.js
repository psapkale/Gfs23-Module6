import { createSlice } from "@reduxjs/toolkit";

const usersData = createSlice({
   name: "usersData",
   initialState: [],
   reducers: {
      setUsersData(state, action) {
         return (state = action.payload);
      },
   },
});

export default usersData.reducer;
export const { setUsersData } = usersData.actions;
