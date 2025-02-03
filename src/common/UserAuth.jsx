import { useEffect } from 'react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({children}) => {
    const user = useSelector((state) => state.user.user1);
    const [loading ,setLoading] = useState(true)
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); 

    useEffect(()=>{
        if (user) {
            setLoading(false)
        }
        if(!token){
            navigate('/login')
        }
    },[])

  return (
    <div>
      {children}
    </div>
  )
}

export default UserAuth
