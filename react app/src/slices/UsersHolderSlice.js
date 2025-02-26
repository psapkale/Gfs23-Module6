import { createSlice } from "@reduxjs/toolkit";

const usersHolder = createSlice({
   name: "usersHolder",
   initialState: [],
   reducers: {
      setUsersHolder(state, action) {
         state = action.payload;
         return;
      },
   },
});

export default usersHolder.reducer;
export const { setUsersHolder } = usersHolder.actions;
