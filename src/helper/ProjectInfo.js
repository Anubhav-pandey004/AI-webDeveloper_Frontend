import { toast } from "react-toastify";
import SummaryApi from "../common";

const  ProjectInfo = async (pro)=>{
    
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
        console.log("refetch ",result);
        
        return result
      } catch (error) {
        toast.error("An error occurred while fetching your projects");
      }
  }
  export default ProjectInfo;