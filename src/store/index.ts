import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import categoryReducer from "./categorySlice";
import articleReducer from "./articleSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    category: categoryReducer,
    article: articleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
