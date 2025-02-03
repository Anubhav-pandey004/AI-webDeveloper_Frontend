import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from './common/index'
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import Context from './Context/context'


const App = () => {
  //useDispatch is a hook used to dispatch actions in Redux, enabling state updates from components.
  const dispatch = useDispatch();
  const fetchUserDetails =async()=>{
    const response = await fetch(SummaryApi.userDetails.url,{
      method:SummaryApi.userDetails.method,
      credentials:'include',
     
    })
    const data = await response.json();  
      
    
    if(data.success){
      dispatch(setUserDetails(data.data))
    }
  }
  useEffect(()=>{
    fetchUserDetails()
  })
  return (
    <>
    <Context.Provider value={{fetchUserDetails}}>
    <ToastContainer
    position='top-center'
    />
    <main className='scrollbar-none'>
    <Outlet/>
    </main>
    </Context.Provider>
    </>
  )
}

export default App
