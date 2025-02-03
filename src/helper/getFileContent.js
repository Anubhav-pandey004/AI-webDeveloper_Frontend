const getFileContent = (fileTree, currentFile) => {
  
  currentFile = currentFile.split('/').pop();
    for (let file in fileTree) {
      if (file === currentFile) {
        return `${fileTree[file].content}`;
      } else if (
        typeof fileTree[file] === "object" &&
        fileTree[file] !== null &&
        "content" in fileTree[file] === false  // Ensure it's a folder, not a file
      ) {
        const subContent = getFileContent(fileTree[file], currentFile);
        if (subContent !== null) {
          return `${subContent}`;
        }
      }
    }
    return null; // Return null if file is not found
  };
  
  export default getFileContent;
  