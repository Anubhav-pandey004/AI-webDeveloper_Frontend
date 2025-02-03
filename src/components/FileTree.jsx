const FileTree = ({ tree, path = "", toggleFolder, openFolders, setOpenFiles, setCurrentFile }) => {
    return (
      <div className="pl-2">
        {Object.keys(tree).map((key, index) => {
          const fullPath = path ? `${path}/${key}` : key;
          const isFile = tree[key]?.content !== undefined;
          const isFolder = !isFile && typeof tree[key] === "object";
  
          return (
            <div key={index} className="pl-2">
              {isFolder ? (
                <>
                  <button className="w-full flex items-center" onClick={() => toggleFolder(fullPath)}>
                    <p className="cursor-pointer font-semibold text-sm md:text-lg text-slate-700 hover:bg-slate-400 hover:text-white p-2 px-2 rounded-md w-full flex">
                      <span className="mr-2">{openFolders[fullPath] ? "📂" : "📁"}</span>
                      {key}
                    </p>
                  </button>
                  {openFolders[fullPath] && (
                    <FileTree
                      tree={tree[key]}
                      path={fullPath}
                      toggleFolder={toggleFolder}
                      openFolders={openFolders}
                      setOpenFiles={setOpenFiles}
                      setCurrentFile={setCurrentFile}
                    />
                  )}
                </>
              ) : (
                <button
                  className="w-full flex items-center"
                  onClick={() => {
                    setOpenFiles((prevFiles) => [...new Set([...prevFiles, fullPath])]);
                    setCurrentFile(fullPath);
                  }}
                >
                  <p className="cursor-pointer font-semibold text-sm md:text-lg text-slate-700 hover:bg-slate-400 hover:text-white p-2 px-2 rounded-md w-full flex">
                    <span className="mr-2">📄</span>
                    {key}
                  </p>
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  export default FileTree
  