

const backendDomain = "https://ai-webdeveloper-backend.onrender.com"

const SummaryApi ={
    login:{
        url:`${backendDomain}/login`,
        method:"post",
    },
    signup:{
        url:`${backendDomain}/signup`,
        method:"post",
    },
    logout:{
        url:`${backendDomain}/logout`,
        method:"post",
    },
    userDetails:{
        url:`${backendDomain}/userdetails`,
        method:"get",
    },
    createProject:{
        url:`${backendDomain}/createproject`,
        method:"post",
    },
    fetchProjects:{
        url:`${backendDomain}/fetchProjects`,
        method:"post",
    },
    projectInfo:{
        url:`${backendDomain}/projectInfo`,
        method:"post",
    },
    fetchUsers:{
        url:`${backendDomain}/fetchUsers`,
        method:"get",
    },
    addCollab:{
        url:`${backendDomain}/addCollab`,
        method:"post",
    },
    saveProjects:{
        url: `${backendDomain}/saveProjects`,
        method:"post",
    },
    deleteProject:{
        url: `${backendDomain}/deleteProject`,
        method:"post",
    }
}
export default SummaryApi
