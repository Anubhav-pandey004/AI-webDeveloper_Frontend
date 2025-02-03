import { createSlice } from '@reduxjs/toolkit'



export const userSlice = createSlice({
    name: 'user',
    initialState: {
      user1:null,
    },
    reducers: {
     setUserDetails : (state,action)=>{
        //its a function 
        state.user1=action.payload
     }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setUserDetails}=userSlice.actions
  export default userSlice.reducer
