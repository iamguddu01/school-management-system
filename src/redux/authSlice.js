import { createSlice, configureStore } from '@reduxjs/toolkit'

const initialState = {
    userName: "Govind",
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserName: (state, action) => {
      state.userName = action.payload
    },
  }
})

export const { updateUserName } = authSlice.actions
export default authSlice.reducer;