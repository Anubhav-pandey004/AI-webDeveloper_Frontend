import SummaryApi from "../common";

const SaveProject = async (updatedFileTree, projectID, commands) => {
  try {
    const filedata = {
      fileTree: updatedFileTree,
      projectID: projectID,
      commands: commands,
    };

    await fetch(SummaryApi.saveProjects.url, {
      method: SummaryApi.saveProjects.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(filedata),
    });
  } catch (error) {
    console.log("An error occurred while saving the project", error);
  }
};

export default SaveProject;
