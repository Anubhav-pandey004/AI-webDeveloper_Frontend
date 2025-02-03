import SummaryApi from "../common";

const FetchUsers = async ({ Currentuser, updateProject }) => {
  try {
    const dataResponse = await fetch(SummaryApi.fetchUsers.url, {
      method: SummaryApi.fetchUsers.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    //this funtion is working fine and giving all users in database
    let allUsers = await dataResponse.json();
    allUsers = allUsers.data;
    // console.log("all users ,",allUsers);
    
    if (!allUsers) {
      throw new Error("No users fetched");
    }

    // Filter out the current user and users already in the project

    // console.log("Fetching users for this project",updateProject);
    
    const projectUserIds = updateProject.users.map((projUser) => projUser._id);
    projectUserIds.push(updateProject.owner);
    // console.log("Project users are ,",projectUserIds);
    

    // Filter out the current user and users already in the project
    const filteredUsers = allUsers.filter(
      (user) =>
        user._id !== Currentuser._id && !projectUserIds.includes(user._id)
    );

    return filteredUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default FetchUsers;
