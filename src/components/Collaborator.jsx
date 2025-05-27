import React, { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import FetchUsers from "../helper/FetchUsers";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import ProjectInfo from "../helper/ProjectInfo";

const Collaborator = ({ onClose , project }) => {
  const [users, setUsers] = useState([]); // All users
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected users
  const Currentuser = useSelector((state) => state.user.user1);
  const [updateProject , setUpdateProject] = useState(project);
  
  // Since updateProject is updated in the second useEffect, it will trigger a re-run of this effect after the state is updated.
  useEffect(() => {
    const fetchData = async () => {
      try {        
        const userList = await FetchUsers({Currentuser,updateProject}); // Assuming FetchUsers returns a list of users
        setUsers(userList); // Store users in state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    // fetchNewProject();
    fetchData();
  }, [Currentuser,updateProject]);

  //fetch updated project
  //This effect runs first because it's independent of the updateProject state.
  //It runs once on mount or whenever project._id changes.

  useEffect(() => {
    const fetchNewProject = async () => {
      try {
        let newpro = await ProjectInfo(project._id);
        newpro = newpro.data;
        setUpdateProject(newpro);
      } catch (error) {
        console.error("Error updating project ", error);
      }
    };
  
    fetchNewProject();
  }, [project._id]);  

  // Toggle user selection
  const toggleUserSelection = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Handle the Add button click
  const handleAddCollaborators = async() => {
    try {      
        const dataResponse = await fetch(SummaryApi.addCollab.url, {
          method: SummaryApi.addCollab.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ selectedUsers , project}),
        });
    
        const result = await dataResponse.json();
      
        if (result.success) {
            toast.success(result.message)      
        }
      } catch (error) {
        console.error("Error adding collaborator", error);
      }
    // You can send `selectedUsers` to your API or process them as needed
    onClose(); // Close the modal after adding collaborators
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[50%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Collaborator</h2>
          <HiOutlineX size={24} className="cursor-pointer" onClick={onClose} />
        </div>
        <section>
          {users.length === 0 ? (
            <p>No users available</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => toggleUserSelection(user)}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                  selectedUsers.some((u) => u._id === user._id)
                    ? "bg-gray-300"
                    : "bg-white"
                }`}
              >
                <p>{user.email}</p>
              </div>
            ))
          )}
        </section>
        <button
          onClick={handleAddCollaborators}
          className="w-full mt-4 p-2 bg-gradient-to-r from-[#65e3ff] to-blue-500 hover:scale-105 transition-all text-white rounded-md"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Collaborator;
