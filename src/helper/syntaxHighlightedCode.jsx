
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // Import any theme you like
import SaveProject from "./SaveProject";

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

  const saveProject = async (updatedFileTree)=>{
    await SaveProject(updatedFileTree,projectID,commands)
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
        className={`rounded-lg p-4 bg-transparent text-white overflow-x-auto scrollbar-none overflow-auto scrollbar-none pb-[10vw] ${
          flag ? "h-[92vh]" : ""
        }`}
      >
        <code
          className="outline-none"
          spellCheck="false"
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
