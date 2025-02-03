import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import NewProject from "../components/NewProject";
import UserProjects from "../components/UserProjects";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const Home = () => {
  const user = useSelector((state) => state.user.user1);
  const [showPopup, setShowPopup] = useState(false);
  const [project, setProject] = useState([]);
  const navigate = useNavigate();

  const Projects = async () => {
    try {
      const userData = {
        user: [user?._id],
      };
      const dataResponse = await fetch(SummaryApi.fetchProjects.url, {
        method: SummaryApi.fetchProjects.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await dataResponse.json();
      setProject(result.data);
      
      
    } catch (error) {
      toast.error("An error occurred while fetching your projects");
    }
  };

  const ProjectInfo = async (pro)=>{
    try {
        const projectData = {
          project: pro,
        };
        const dataResponse = await fetch(SummaryApi.projectInfo.url, {
          method: SummaryApi.projectInfo.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(projectData),
        });
  
        const result = await dataResponse.json();
        console.log(result);
        if (result.success) {
            navigate(`/project/${pro}`, { state: { projectData: result.data } });
        }
        
      } catch (error) {
        toast.error("An error occurred while fetching your projects");
      }
  }
  useEffect(() => {
    // Projects() // remove if error
    if (user) {
      Projects();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex items-center justify-center">
      <button
        onClick={() => {
          setShowPopup(!showPopup);
        }}
        className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex items-center gap-2"
      >
        <FaPlus /> Create New Project
      </button>

      {showPopup && <NewProject Projects={Projects} onClose={() => setShowPopup(!showPopup)} />}
      <div className="mt-20 justify-center sm:justify-start flex flex-wrap items-center gap-5 p-5 overflow-hidden w-full ">
        {project.map((item) => {
          return (
            <UserProjects
              key={item._id}
              onClick={() => {
                ProjectInfo(item._id)
              }}
              project={item}
              user={user._id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
