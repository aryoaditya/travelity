import { createSlice } from "@reduxjs/toolkit";

interface ArticleState {
  refetchTrigger: number;
}

const initialState: ArticleState = {
  refetchTrigger: 0,
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    triggerRefetch: (state) => {
      state.refetchTrigger += 1;
    },
  },
});

export const { triggerRefetch } = articleSlice.actions;
export default articleSlice.reducer;
