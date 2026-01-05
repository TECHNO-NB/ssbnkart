import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  gender: string;
  dob: string;
}

const initialState: userState = {
   id: "",
  fullName: "",
  email: "",
  role: "",
  phone: "",
  gender: "",
  dob: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state:userState, action: PayloadAction<userState>) => {
      state.id = action.payload.id;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.phone = action.payload.phone;
      state.dob = action.payload.dob;
      state.gender = action.payload.gender;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
