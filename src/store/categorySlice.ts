import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  selectedCategory: string;
}

const initialState: CategoryState = {
  selectedCategory: "",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = "";
    },
  },
});

export const { setSelectedCategory, clearSelectedCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
