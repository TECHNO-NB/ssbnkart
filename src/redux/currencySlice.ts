import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define the shape of the data object
export interface CurrencyData {
  currencyCode: string; // e.g., "CAD", "USD"
  countryCode: string;  // e.g., "CA", "US"
  rates: number;        // e.g., 1.39
}

// 2. Define the State Interface
export interface CurrencyState {
  data: CurrencyData | null; // It can be null initially
}

// 3. Initial State (Empty at start)
const initialState: CurrencyState = {
  data: null, 
  // OR set a default:
  // data: { currencyCode: "USD", countryCode: "US", rates: 1 }
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    // Action to update the currency data
    setCurrency(state, action: PayloadAction<CurrencyData>) {
      state.data = action.payload;
    },

    // Action to reset/clear (Optional)
    resetCurrency(state) {
      state.data = null;
    },
  },
});

export const { setCurrency, resetCurrency } = currencySlice.actions;

export default currencySlice.reducer;