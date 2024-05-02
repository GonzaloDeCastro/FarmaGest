import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../redux/productsSlice";

export default configureStore({
  reducer: {
    product: productsReducer,
  },
});
