import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuSendHorizontal } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import { TiUserOutline } from "react-icons/ti";
import { RiGroupLine } from "react-icons/ri";
import { GoDownload } from "react-icons/go";
import Collaborator from "../components/Collaborator";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../common/socket";
import { useSelector } from "react-redux";
import Markdown from "markdown-to-jsx";
import { syntaxHighlightedCode } from "../helper/syntaxHighlightedCode";
import formatAiRes from "../helper/formatAiRes";
import getFileContent from "../helper/getFileContent";
import "highlight.js/styles/github-dark.css";
import { getWebContainer } from "../helper/webContainer";
import formatFile from "../helper/formatFile";
import RunProject from "../helper/RunProject";
import FileTree from "../components/FileTree";
import "@xterm/xterm/css/xterm.css";
import { CiPlay1 } from "react-icons/ci";
import SaveProject from "../helper/SaveProject";
import { MdHome } from "react-icons/md";
import { FaWandMagicSparkles } from "react-icons/fa6";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import PageNotFound from "./PageNotFound";
import Loader from "../components/Loader";

const ProjectDetails = () => {
  const location = useLocation();
  const project = location.state?.projectData;

  const [isGroupVisible, setGroupVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State to store all messages
  const [isCollaboratorVisible, setCollaboratorVisible] = useState(false);
  const Currentuser = useSelector((state) => state.user.user1);
  const messageBox = useRef(null);
  const [openFolders, setOpenFolders] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [aiResponse, setAiResponse] = useState(null);
  const [fileTree, setFileTree] = useState({});
  const [iframeURL, setiFrameURL] = useState(null);
  const [runProcess, setRunProcess] = useState(null);
  const [commands, setCommnads] = useState({});
  const [magicLoader, setMagicLoader] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const terminalRef = useRef(null);

  const [webContainer, setWebContainer] = useState(null);
  const user = useSelector((state) => state.user.user1);
  const navigate = useNavigate();

  const toggleGroupVisibility = () => setGroupVisible(!isGroupVisible);
  const openCollaborator = () => setCollaboratorVisible(true);
  const closeCollaborator = () => setCollaboratorVisible(false);

  if (!project) {
    return <PageNotFound />;
  }

  //handlaing incoming messages from Ai and Collaborater
  useEffect(() => {
    initializeSocket(project._id);
    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
      });
    }

    setFileTree(project.fileTree);
    setCommnads(project.commands);
    receiveMessage("project-message-receive", async (data) => {
      if (data.user.email == "AI") {
        let temp = formatAiRes({ message: data?.message });
        //updating postcss.config.js as it is most error prone
        if (temp?.fileTree?.frontend?.["postcss.config.js"]) {
          temp.fileTree.frontend[
            "postcss.config.js"
          ].content = `export default {
              plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
              },
          };`;
        } else {
          console.warn("postcss.config.js not found!");
        }


        setAiResponse(temp);

        if (temp?.fileTree != null && Object.keys(temp.fileTree).length > 0) {
          // console.log("check ",temp?.fileTree," ",Object.keys(temp.fileTree));
          setFileTree(temp.fileTree);
        }

        setCommnads({
          buildCommand: temp?.buildCommand,
          startCommand: temp?.startCommand,
        });
        let formatedFileTree = formatFile(temp?.fileTree);
        //error may cause
        await SaveProject(temp.fileTree, project._id, {
          buildCommand: temp?.buildCommand,
          startCommand: temp?.startCommand,
        });
        await webContainer?.mount(formatedFileTree); //file.container
      }
      appendIncomingMessage(data);
    });
    if (!user) {
      navigate("/login");
    }
  }, []);

  // wraping message in backticks when you send any message
  //remove . and , before seniing to ai
  function send() {
    const data = {
      message: `\`${message.replace(/\./g, "")}\``,
      user: Currentuser,
      fileTree: aiResponse?.fileTree || project?.fileTree,
    };
    sendMessage("project-message", data);
    appendOutgoingMessage(data);
    setMessage(""); // Clear input field
    scrollToBottom();
  }

  function appendIncomingMessage(messageObject) {
    setMessages((prev) => [...prev, { ...messageObject, type: "incoming" }]);
    scrollToBottom();
  }
  function appendOutgoingMessage(messageObject) {
    setMessages((prev) => [...prev, { ...messageObject, type: "outgoing" }]);
    scrollToBottom();
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      send();
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }

  // Toggle folder open/close state
  const toggleFolder = (folder) => {
    setOpenFolders((prevState) => ({
      ...prevState,
      [folder]: !prevState[folder],
    }));
  };

  //if sender of msg is AI display msg in below template
  function writeAiMessage(message) {
    // Convert the cleaned JSON string to an object
    const messageObject = formatAiRes({ message });
    return (
      <div className="bg-[#2f3056] text-white p-3 rounded-lg break-words whitespace-normal shadow-sm  scrollbar-none">
        {syntaxHighlightedCode(`${messageObject.text}`, "javascript")}
      </div>
    );
  }

  const magicPen = async (prompt) => {
    // prompt = prompt.replace(/\./g, "");
    setMagicLoader(true);
    const dataResponse = await fetch(SummaryApi.enhance.url, {
      method: SummaryApi.enhance.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const result = await dataResponse.json();
    setMessage("@ai " + result.data);
    setMagicLoader(false);
  };
  const HandleDownloade = async (ProjectId, projectName = "Project") => {
  try {
    const dataResponse = await fetch(SummaryApi.export.url, {
      method: SummaryApi.export.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ProjectId }),
    });

    if (!dataResponse.ok) {
      const errorText = await dataResponse.text();
      toast.error("Download failed: " + errorText);
      return;
    }

    const blob = await dataResponse.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    toast.success("Project downloaded successfully!");
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Something went wrong while downloading the project.");
  }
};

  return (
    <main className="h-full w-screen flex relative overflow-hidden">
      <section
        className={`fixed top-0 left-0 h-full w-[35vw] bg-[#1c2333] z-20 text-white transform transition-transform shadow-[#e9ecef] shadow-inner ${
          isGroupVisible ? "translate-x-0" : "-translate-x-[100vw]"
        }`}
      >
        <div className="flex justify-between text-white p-4 bg-[#161a1d] items-center mb-4">
          <h1 className="md:font-bold md:text-xl text-xs font-light font-serif">
            Collaborator
          </h1>
          <HiOutlineX
            className="cursor-pointer md:text-xl  text-xs"
            size={24}
            onClick={toggleGroupVisibility}
          />
        </div>
        <div className="flex flex-col justify-start items-start h-full w-full md:p-4 text-white">
          {project.users.length === 0 ? (
            <div>No users available</div>
          ) : (
            project.users.map((item) => (
              <section
                key={item._id}
                className="mb-2 text-white flex gap-2 hover:bg-[#2c364e] w-full h-[3vw] cursor-pointer p-2 rounded-md"
              >
                <div className="h-7 w-7 shrink-0 rounded-full bg-[#161a1d] text-white flex justify-center items-center text-xl">
                  <TiUserOutline />
                </div>
                {item.username}
              </section>
            ))
          )}
        </div>
      </section>

      <section className="md:w-4/12 w-5/12 bg-[#001021] border-r-2 border-[#3C445C] relative h-screen overflow-y-auto overflow-x-hidden scrollbar-none ">
        <header className="flex z-10 justify-between items-center w-full p-4 bg-[#1c2333] border-y-2 border-[#3C445C]  sticky top-0">
          <h1
            className=" text-2xl font-semibold cursor-pointer hover:scale-110 transition-all text-[#9da2a6] hover:text-white"
            onClick={() => {
              navigate("/");
            }}
          >
            <MdHome />
          </h1>
          <h1 className="text-lg font-semibold lg:block hidden text-[#9da2a6]">
            {project.projectName}
          </h1>
          <button
            onClick={openCollaborator}
            className="flex items-center gap-2  text-[#9da2a6] p-2 rounded-md hover:text-white"
          >
            <FaPlus size={16} />
            <h3 className="hidden lg:block">Add Collaborator</h3>
          </button>
          <h1 className="flex items-center gap-2 text-[#9da2a6] hover:text-white">
            <RiGroupLine
              size={24}
              className="cursor-pointer"
              onClick={toggleGroupVisibility}
            />
          </h1>
        </header>

        <div
          ref={messageBox}
          className="message-box p-6 overflow-y-auto h-[84vh] scrollbar-none"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-3 relative max-w-[98%] mb-4 ${
                msg.user._id == Currentuser._id ? "justify-end" : ""
              }`}
            >
              <p className="text-xs font-extralight text-slate-500 absolute top-0">
                {msg.user.username}
              </p>
              <div className="bg-[#2b3245] text-[#9da2a6] border-2 text-xs border-[#3C445C] shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold my-5">
                {msg.user.username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                {msg.user.username == "ai" ? (
                  writeAiMessage(msg.message)
                ) : (
                  <div className="bg-[#2b3245] text-white p-3 rounded-lg shadow-sm break-words whitespace-normal ">
                    <Markdown className="text-sm">{msg.message}</Markdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky absolute bottom-0 left-0 w-full p-4 bg-[#0e1525] border-t-2 border-[#3C445C] flex items-center gap-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 bg-[#1c2333] text-white rounded-md"
            value={message}
            onKeyDown={handleKeyPress}
            onChange={(e) => setMessage(e.target.value)}
          />

          {magicLoader ? (
            <Loader />
          ) : (
            <FaWandMagicSparkles
              size={24}
              className="cursor-pointer text-white"
              onClick={() => {
                if (message) {
                  magicPen(message);
                }
              }}
            />
          )}

          <LuSendHorizontal
            size={24}
            className="cursor-pointer text-white"
            onClick={() => {
              if (message) {
                send();
              }
            }}
          />
        </div>
      </section>

      {isCollaboratorVisible && (
        <Collaborator onClose={closeCollaborator} project={project} />
      )}
      <section className="right bg-[#001021] w-full flex overflow-hidden ">
        <div className="explorer max-w-64">
          <div className="file-tree">
            <div className="tree-element h-screen bg-[#1c2333] border-r-2 border-[#3C445C] py-2 overflow-y-auto overflow-x-hidden scrollbar-none">
              {/* object to keys retun array of all elements in fileTree and then map on array */}

              {fileTree && (
                <FileTree
                  tree={fileTree}
                  toggleFolder={toggleFolder}
                  openFolders={openFolders}
                  setOpenFiles={setOpenFiles}
                  setCurrentFile={setCurrentFile}
                />
              )}
            </div>
          </div>
        </div>
        <div className="code-editor w-full overflow-auto scrollbar-none">
          {currentFile && (
            <div className="code-editor flex flex-col flex-grow h-full w-full ">
              <div className="top flex overflow-auto scrollbar-none bg-[#001021] border-y-2 border-[#3C445C] ">
                {openFiles.map((file, index) => {
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <button
                        className="w-fit pr-3 pl-3 py-3 focus:bg-[#2c364e] hover:bg-[#2c364e] h-full"
                        onClick={() => {
                          setCurrentFile(file);
                        }}
                      >
                        <p className="cursor-pointer font-semibold text-sm md:text-lg text-white hover:to-blue-700">
                          {file}
                        </p>
                      </button>
                      <button
                        className="text-white font-bold hover:text-red-500"
                        onClick={() => {
                          setOpenFiles((prevFiles) =>
                            prevFiles.filter((item) => item !== file)
                          );
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                <div className="h-[10vw] min-h-[50px] max-h-[50vh] resize-y w-full absolute bottom-0 z-30  overflow-hidden">
                  <div
                    ref={terminalRef}
                    id="terminal"
                    className="terminal h-full w-full overflow-y-auto "
                  ></div>
                </div>
                {/* {project.fileTree && ( */}
                <div>
                  <button
                    className="text-[#bfffca] h-7 flex justify-center items-center bg-[#046113] hover:bg-[#04891a] text-lg px-2 absolute right-20 top-3 rounded-md"
                    onClick={() => {
                      HandleDownloade(project._id,project.projectName);
                    }}
                  >
                    <GoDownload /> Export
                  </button>
                  <button
                    className={`text-[#bfffca] h-7 flex justify-center items-center bg-[#046113] text-lg px-2 absolute right-2 top-3 rounded-md ${
                      isRunning
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#04891a]"
                    }`}
                    onClick={async () => {
                      if (isRunning) return;
                      setIsRunning(true);
                      await RunProject({
                        fileTree,
                        runProcess,
                        setRunProcess,
                        webContainer,
                        setWebContainer,
                        commands,
                        setiFrameURL,
                        terminalRef,
                      });
                      setIsRunning(false);
                    }}
                    disabled={isRunning}
                  >
                    <CiPlay1 />
                    Run
                  </button>
                </div>
                {/* )} */}
              </div>
              <div className="bottom bg-[#001021]  flex flex-grow max-w-full ">
                {/* printing code editer */}

                {fileTree &&
                  getFileContent(fileTree, currentFile) &&
                  openFiles.includes(currentFile) && (
                    <div className="w-full ">
                      {syntaxHighlightedCode(
                        `${getFileContent(fileTree, currentFile) || ""}`,
                        "javascript",
                        true,
                        setFileTree,
                        currentFile,
                        fileTree,
                        project._id,
                        commands
                      )}
                      {/* <div ref={terminalRef} className="terminal h-20 w-full bg-white"></div> */}
                    </div>
                  )}
                {iframeURL && webContainer && (
                  <div className="flex flex-col h-full min-w-96 w-full bg-white ">
                    <div className="address-bar ">
                      <input
                        type="text"
                        onChange={(e) => setiFrameURL(e.target.value)}
                        value={iframeURL}
                        className="w-full p-2 px-4 "
                      />
                    </div>
                    <iframe
                      src={iframeURL}
                      className="w-full  h-[72%] border-y-2 border-[#3C445C]"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProjectDetails;
