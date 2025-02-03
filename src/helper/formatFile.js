const formatFile = (oldfileTree) => {
  const newFileTree = {};

  const traverseAndFormat = (tree, path = "", parent = newFileTree) => {
    for (let key in tree) {
      const fullPath = path ? `${path}/${key}` : key;

      if (tree[key] && typeof tree[key] === "object" && "content" in tree[key]) {
        // If it's a file, add it under the correct directory
        parent[key] = { file: { contents: tree[key].content } };
      } else if (tree[key] && typeof tree[key] === "object") {
        // If it's a directory, create a "directory" object
        parent[key] = { directory: {} };
        traverseAndFormat(tree[key], fullPath, parent[key].directory);
      }
    }
  };

  traverseAndFormat(oldfileTree);
  return newFileTree;
};

export default formatFile;


// const formatFile = (oldfileTree) => {
//   const newFileTree = {};

//   const traverseAndFormat = (tree, path = "", parent = newFileTree) => {
//     for (let key in tree) {
//       const fullPath = path ? `${path}/${key}` : key;

//       if (tree[key] && typeof tree[key] === "object" && "content" in tree[key]) {
//         // If it's a file, add it under the correct directory
//         parent[key] = { file: { contents: tree[key].content } };
//       } else if (tree[key] && typeof tree[key] === "object") {
//         // If it's a directory, create a "directory" object
//         parent[key] = { directory: {} };
//         traverseAndFormat(tree[key], fullPath, parent[key].directory);
//       }
//     }
//   };

//   traverseAndFormat(oldfileTree);

//   // Preserve buildCommand and startCommand as-is
//   newFileTree.buildCommand = oldfileTree.buildCommand 
  
//  newFileTree.startCommand = oldfileTree.startCommand
 

//   return newFileTree;
// };

// export default formatFile;


