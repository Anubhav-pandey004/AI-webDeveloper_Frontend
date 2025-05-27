import React from 'react';
import { useForm } from 'react-hook-form';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PopupComponent = ({ onClose , Projects}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user1);

    // Handle form submission
    const onSubmit = async (data) => {
        if (!user) {
            toast.error("User not found");
            navigate('/login');
        }
        const projectData = {
            projectName: data.projectName,
            // users: [user._id]
            owner:user._id
        };
        
        try {
            const dataResponse = await fetch(SummaryApi.createProject.url, {
                method: SummaryApi.createProject.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(projectData)
            });

            const result = await dataResponse.json();

            if (result.success) {
                toast.success(result.message);
                Projects();
                onClose();
            }
            if (result.error) {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred while creating the project.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Create New Project</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="Project Name"
                        className="w-full text-black p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('projectName', {
                            required: 'Project name is required', // Simple validation
                            minLength: { value: 3, message: 'Project name must be at least 3 characters long' }
                        })}
                    />
                    {errors.projectName && <p className="text-red-500 text-sm">{errors.projectName.message}</p>}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupComponent;
