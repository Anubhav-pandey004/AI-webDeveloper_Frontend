import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

// Store setup
export const store = configureStore({
  reducer: {
    user : userReducer
  },
  
})