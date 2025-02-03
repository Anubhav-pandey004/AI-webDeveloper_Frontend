import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        try {
            const response = await fetch(SummaryApi.signup.url, {
                method: SummaryApi.signup.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                navigate('/login');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('An error occurred during signup.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center">Sign Up</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block mb-1">Username</label>
                        <input
                            {...register('username', { required: 'Username is required' })}
                            className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

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
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' } })}
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-1">Confirm Password</label>
                        <input
                            type="password"
                            {...register('confirmPassword', { required: 'Please confirm your password' })}
                            className="w-full p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white"
                    >
                        Sign Up
                    </button>

                    {/* Already have an account? */}
                    <p className="text-center text-gray-400">
                        Already have an account? <a onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
