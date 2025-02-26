import { createSlice } from "@reduxjs/toolkit";

const usersHolder = createSlice({
   name: "usersHolder",
   initialState: [],
   reducers: {
      setUsersHolder(state, action) {
         return (state = action.payload);
      },
   },
});

export default usersHolder.reducer;
export const { setUsersHolder } = usersHolder.actions;
