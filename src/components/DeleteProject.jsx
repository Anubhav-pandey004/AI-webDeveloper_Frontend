import React from "react";
import SummaryApi from "../common";

const DeleteProject = ({ project, setDeletePopup, deletePopup }) => {
  const deleteProject = async () => {
    
    const response = await fetch(SummaryApi.deleteProject.url, {
      method: SummaryApi.deleteProject.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: project._id }),
    });
    const dataResponse = await response.json();
    if (dataResponse.success) {
      setDeletePopup(!deletePopup);
      window.location.reload();
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <button
        className="hover:text-red-500 text-xl font-semibold"
        onClick={(e) => {
          deleteProject();
          e.stopPropagation();
          setDeletePopup(!deletePopup);
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteProject;
