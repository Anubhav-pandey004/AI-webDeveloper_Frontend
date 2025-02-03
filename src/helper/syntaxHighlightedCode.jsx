// import hljs from "highlight.js";
// import "highlight.js/styles/github-dark.css"; // Import any theme you like
// import SummaryApi from "../common";

// /**
//  * Function to highlight the given code snippet.
//  *
//  * @param {string} code - The code snippet to highlight.
//  * @param {string} [language="javascript"] - Programming language (default: JavaScript).
//  * @returns {JSX.Element} - Highlighted code wrapped in <pre><code> tags or error message if input is invalid.
//  */
// export function syntaxHighlightedCode(
//   code,
//   language = "javascript",
//   flag = false,
//   setFileTree, // Add this prop to update the file tree
//   currentFile, // Add this prop to get the current file
//   fileTree, // Add this prop to pass the file tree for updates,
//   projectID,
//   commands
// ) {
//   if (typeof code !== "string" || code.trim() === "") {
//     return (
//       <pre className="rounded-lg p-4 bg-red-800 text-white">
//         Error: Invalid code input. Please provide a valid code snippet.
//       </pre>
//     );
//   }
//   // console.log("Trying to save files ",projectID," ",fileTree);
//   const saveProject = async (updatedFileTree)=>{
//     try {
//       const filedata = {
//         fileTree: updatedFileTree,
//         projectID:projectID,
//         commands:commands
//       };
//       console.log("save this tree ",filedata);
      
//       const dataResponse = await fetch(SummaryApi.saveProjects.url, {
//         method: SummaryApi.saveProjects.method,
//         credentials: "include",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(filedata),
//       });

//       const result = await dataResponse.json();
//       console.log("Project saved ",result);
      
//     } catch (error) {
//       console.log
//       ("An error occurred while saving the project",error);
//     }
//   }
  
//   try {
//     const sanitizedCode = code;
//     const highlightedCode = language
//       ? hljs.highlight(sanitizedCode, { language }).value
//       : hljs.highlightAuto(sanitizedCode).value;

//     return (
//       <pre
//         className={`rounded-lg p-4 bg-gray-800 text-white overflow-x-auto scrollbar-none overflow-auto scrollbar-none ${
//           flag ? "h-[92vh]" : ""
//         }`}
//       >
//         <code
//           className="outline-none"
//           contentEditable={flag}
//           suppressContentEditableWarning={flag}
//           onBlur={(e) => {
//             // Capture the new content and save it
//             const updatedContent = e.target.innerText;
//             console.log("updated content", updatedContent );
          
//             // Update the content of the file in the fileTree
//             setFileTree((prevFileTree) => {
//               const updatedTree = { ...prevFileTree }; // Create a shallow copy of the fileTree

//               // Recursive function to update the file content
//               const updateFileContent = (tree) => {
//                 for (let file in tree) {
//                   if (currentFile.includes("/")) {
//                     currentFile = currentFile.split("/")[1];
//                   }

//                   if (
//                     file == currentFile &&
//                     typeof tree[file] === "object" &&
//                     "content" in tree[file]
//                   ) {
//                     // If the current file is found, update its content
                    
                    
//                     tree[file].content = e.target.innerText ;

//                     return true; // Stop recursion once the file is updated
//                   }

//                   // If the current node is an object, recursively traverse its children
//                   if (typeof tree[file] === "object" && tree[file] !== null) {
//                     let folder;
//                     Object.keys(tree[file]).forEach((key) => {
//                       console.log(currentFile);
//                       if (currentFile.includes("/")) {
                        
//                         folder = currentFile.split("/")[0];
//                         currentFile = currentFile.split("/").pop();
//                       }

//                       if (
//                         typeof tree[file][key] === "object" &&
//                         key === currentFile
//                       ) {
//                         updateFileContent(tree[file]); // Recursive call for nested objects
//                       } else {
//                         console.log("open folder .",folder);
                        
//                         updateFileContent(tree[folder])
//                       }
//                     });
//                     // const found = updateFileContent(tree[file]); // Recursive call
//                     // if (found) return true; // Stop further recursion if the file is found
//                   }
//                 }

//                 return false; // File not found at this level or in nested objects
//               };

//               updateFileContent(updatedTree); // Start recursive update from the root
//               saveProject(updatedTree)
//               return updatedTree; // Return updated fileTree
//             });
//           }}
//           dangerouslySetInnerHTML={{ __html: highlightedCode }}
//         />
//       </pre>
//     );
//   } catch (error) {
//     console.error("Syntax highlighting error:", error);
//     return (
//       <pre className="rounded-lg p-4 bg-red-800 text-white ">
//         Error: Failed to highlight code. Please check for syntax issues.
//       </pre>
//     );
//   }
// }



















import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // Import any theme you like
import SummaryApi from "../common";

/**
 * Function to highlight the given code snippet.
 *
 * @param {string} code - The code snippet to highlight.
 * @param {string} [language="javascript"] - Programming language (default: JavaScript).
 * @returns {JSX.Element} - Highlighted code wrapped in <pre><code> tags or error message if input is invalid.
 */
export function syntaxHighlightedCode(
  code,
  language = "javascript",
  flag = false,
  setFileTree, // Add this prop to update the file tree
  currentFile, // Add this prop to get the current file
  fileTree, // Add this prop to pass the file tree for updates,
  projectID,
  commands
) {
  if (typeof code !== "string" || code.trim() === "") {
    return (
      <pre className="rounded-lg p-4 bg-red-800 text-white">
        Error: Invalid code input. Please provide a valid code snippet.
      </pre>
    );
  }
  // console.log("Trying to save files ",projectID," ",fileTree);
  const saveProject = async (updatedFileTree)=>{
    try {
      const filedata = {
        fileTree: updatedFileTree,
        projectID:projectID,
        commands:commands
      };
      
      const dataResponse = await fetch(SummaryApi.saveProjects.url, {
        method: SummaryApi.saveProjects.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(filedata),
      });

      const result = await dataResponse.json();
      
    } catch (error) {
      console.log
      ("An error occurred while saving the project",error);
    }
  }
  const updateFileContent = (tree, pathArray, newContent) => {
    if (pathArray.length === 1) {
      const fileName = pathArray[0];
      if (tree[fileName] && typeof tree[fileName] === "object" && "content" in tree[fileName]) {
        tree[fileName].content = newContent; // ✅ Update file content
        return true;
      }
      return false;
    }
  
    const folderName = pathArray[0];
    if (tree[folderName] && typeof tree[folderName] === "object") {
      return updateFileContent(tree[folderName], pathArray.slice(1), newContent);
    }
    return false;
  };
  
  try {
    const sanitizedCode = code;
    const highlightedCode = language
      ? hljs.highlight(sanitizedCode, { language }).value
      : hljs.highlightAuto(sanitizedCode).value;

    return (
      <pre
        className={`rounded-lg p-4 bg-gray-800 text-white overflow-x-auto scrollbar-none overflow-auto scrollbar-none pb-[10vw] ${
          flag ? "h-[92vh]" : ""
        }`}
      >
        <code
          className="outline-none"
          contentEditable={flag}
          suppressContentEditableWarning={flag}
          onBlur={(e) => {
            const updatedContent = e.target.innerText;
          
            setFileTree((prevFileTree) => {
              const updatedTree = { ...prevFileTree }; // Create a shallow copy
          
              const pathArray = currentFile.split("/"); // ✅ Split path for subfolder navigation
              updateFileContent(updatedTree, pathArray, updatedContent); // ✅ Update content recursively
          
              saveProject(updatedTree); // ✅ Save changes
              return updatedTree;
            });
          }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    );
  } catch (error) {
    console.error("Syntax highlighting error:", error);
    return (
      <pre className="rounded-lg p-4 bg-red-800 text-white ">
        Error: Failed to highlight code. Please check for syntax issues.
      </pre>
    );
  }
}
