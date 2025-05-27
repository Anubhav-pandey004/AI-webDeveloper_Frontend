
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SummaryApi from '../common/index'
import { toast } from 'react-toastify';
import Context from '../Context/context';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const {fetchUserDetails} = useContext(Context)

   

    const onSubmit = async(e) => {
        const dataResponse=await fetch(SummaryApi.login.url,{
          method:SummaryApi.login.method,
          credentials:'include',
          headers:{
            "content-type" : "application/json"
          },
          body:JSON.stringify(e)
        })
    
        const data=await dataResponse.json()
        localStorage.setItem('token', JSON.stringify(data.data));
        
        if(data.success){
          toast.success(data.message)
          navigate("/")
          fetchUserDetails()
        }
        if(data.error)
        {
          toast.error(data.message)
        }
      };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#001021] text-white">
            <div className="w-full max-w-md p-8 space-y-6 border-2 bg-[#000f1e] border-[#3C445C] rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    

                    {/* Email */}
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required',minLength: { value: 6, message: 'Password must be at least 6 characters' }})}
                                className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-[#65e3ff] to-blue-500 hover:scale-105 transition-all rounded-lg font-semibold text-white"
                    >
                        Login
                    </button>

                    {/* No Account? */}
                    <p className="text-center text-gray-400">
                        Don't have an account? <a onClick={()=>navigate("/signup")} className="text-blue-400 cursor-pointer">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
