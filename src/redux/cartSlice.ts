import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface CartItem {
  id: string;
}


export interface CartState {
  items: CartItem[];
}


const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<string>) {
      const exists = state.items.some(item => item.id === action.payload);
      if (!exists) {
        state.items.push({ id: action.payload });
      }
    },
  
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  
    resetCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
