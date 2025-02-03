import React, { useState } from "react";
import { FaUsers, FaProjectDiagram } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import DeleteProject from "./DeleteProject";

const UserProjects = ({ project , onClick ,user }) => {
  const [deletePopup,setDeletePopup] = useState(false);
  return (
    <div 
    onClick={onClick}
    className="bg-white shadow-lg rounded-lg p-5 flex flex-col items-center text-center hover:shadow-xl hover:scale-105 transition-transform cursor-pointer w-full sm:w-[45%] md:w-[30%] lg:w-[20%] transform">
      <div className="flex items-start ">
      <div className="bg-blue-500 text-white rounded-full p-4 mb-3 relative w-full">
        <FaProjectDiagram size={24} />
      </div>
      {user == project?.owner?._id && (
        <div className="flex items-center gap-2 text-gray-600 mb-2 absolute right-2 top-2 hover:text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          setDeletePopup(!deletePopup);
        }}
        >
          <MdDeleteOutline />
        </div>
      )}
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {project.projectName}
      </h2>
      <div className="flex items-center gap-2 text-gray-600">
        <FaUsers size={18} />
        <span>{project.users.length} Users</span>
      </div>
      {
        deletePopup && DeleteProject({project,setDeletePopup,deletePopup})
      }
    </div>
  );
};

export default UserProjects;
