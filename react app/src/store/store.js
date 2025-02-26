import { configureStore } from "@reduxjs/toolkit";
import productsData from "../slices/ProductsSlice";
import usersData from "../slices/UsersSlice";
import usersHolder from "../slices/UsersHolderSlice";

const store = configureStore({
   reducer: {
      productsData: productsData,
      usersData: usersData,
      usersHolder: usersHolder,
   },
});

export default store;
