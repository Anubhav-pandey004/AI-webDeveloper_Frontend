import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPaperPlane, FaPlus } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import { TiUserOutline } from "react-icons/ti";
import { RiGroupLine } from "react-icons/ri";
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
import SummaryApi from "../common";

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
  const terminalRef = useRef(null);

  const [webContainer, setWebContainer] = useState(null);
  const user = useSelector((state) => state.user.user1);
  const navigate = useNavigate();

  const toggleGroupVisibility = () => setGroupVisible(!isGroupVisible);
  const openCollaborator = () => setCollaboratorVisible(true);
  const closeCollaborator = () => setCollaboratorVisible(false);

  if (!project) {
    return <div>Project not found</div>;
  }

  //handlaing incoming messages from Ai and Collaborater
  useEffect(() => {
    initializeSocket(project._id);
    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("container started");
      });
    }
    console.log(project);

    setFileTree(project.fileTree);
    setCommnads(project.commands);
    receiveMessage("project-message-receive", async (data) => {
      if (data.user.email == "AI") {
        let temp = formatAiRes(data.message);
        setAiResponse(temp);
        setFileTree(temp?.fileTree);
        setCommnads({
          buildCommand: temp?.buildCommand,
          startCommand: temp?.startCommand,
        });
        let formatedFileTree = formatFile(temp?.fileTree);

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
    };
    // console.log("Sending message", data);
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
    const messageObject = formatAiRes(message);
    return (
      <div className="bg-slate-800 text-white p-3 rounded-lg break-words whitespace-normal shadow-sm  scrollbar-none">
        {syntaxHighlightedCode(`${messageObject.text}`, "javascript")}
      </div>
    );
  }

  // console.log(
  //   "ai response ",
  //   aiResponse,
  //   " ",
  //   fileTree,
  //   " and formed commands ",
  //   commands
  // );

  return (
    <main className="h-full w-screen flex relative overflow-hidden">
      <section
        className={`fixed top-0 left-0 h-full w-[35vw] bg-[#f5f3f4] z-20 text-white transform transition-transform shadow-[#e9ecef] shadow-inner ${
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
        <div className="flex flex-col justify-start items-start h-full w-full md:p-4 text-black">
          {project.users.length === 0 ? (
            <div>No users available</div>
          ) : (
            project.users.map((item) => (
              <section
                key={item._id}
                className="mb-2 text-black flex gap-2 hover:bg-slate-200 w-full h-[6vw] cursor-pointer p-2 rounded-md"
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

      <section className="md:w-4/12 w-5/12 bg-[#f8f9fa] relative h-screen overflow-y-auto overflow-x-hidden scrollbar-none ">
        <header className="flex z-10 justify-between items-center w-full p-4 bg-[#e9ecef] sticky top-0">
          <h1 className="text-lg font-semibold lg:block hidden">
            {project.projectName}
          </h1>
          <button
            onClick={openCollaborator}
            className="flex items-center gap-2  text-black p-2 rounded-md"
          >
            <FaPlus size={16} />
            <h3 className="hidden lg:block">Add Collaborator</h3>
          </button>
          <div className="flex items-center gap-2">
            <RiGroupLine
              size={24}
              className="cursor-pointer"
              onClick={toggleGroupVisibility}
            />
          </div>
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
              <div className="bg-blue-500 text-white shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold my-5">
                {msg.user.username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                {msg.user.username == "ai" ? (
                  writeAiMessage(msg.message)
                ) : (
                  <div className="bg-white p-3 rounded-lg shadow-sm break-words whitespace-normal ">
                    <Markdown className="text-sm">{msg.message}</Markdown>
                  </div>
                )}
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky absolute bottom-0 left-0 w-full p-4 bg-[#e9ecef] flex items-center gap-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 bg-[#ced4da] text-[#212529] rounded-md"
            value={message}
            onKeyDown={handleKeyPress}
            onChange={(e) => setMessage(e.target.value)}
          />
          <FaPaperPlane
            size={24}
            className="cursor-pointer text-black"
            onClick={send}
          />
        </div>
      </section>

      {isCollaboratorVisible && (
        <Collaborator onClose={closeCollaborator} project={project} />
      )}
      <section className="right bg-blue-950 w-full flex overflow-hidden ">
        <div className="explorer max-w-64">
          <div className="file-tree">
            <div className="tree-element h-screen bg-slate-400 py-2 overflow-y-auto">
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
        <div className="code-editor w-full">
          {currentFile && (
            <div className="code-editor flex flex-col flex-grow h-full w-full ">
              <div className="top flex overflow-auto scrollbar-none ">
                {openFiles.map((file, index) => {
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <button
                        className="w-fit pr-3 pl-3 py-3 focus:bg-slate-500 hover:bg-slate-500 h-full"
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
                    className="terminal h-full w-full overflow-y-auto"
                  ></div>
                </div>

                <button
                  className="text-white mix-blend-difference text-2xl font-extrabold absolute right-0 top-3"
                  onClick={() => {
                    RunProject({
                      fileTree,
                      runProcess,
                      setRunProcess,
                      webContainer,
                      setWebContainer,
                      commands,
                      setiFrameURL,
                      terminalRef,
                    });
                  }}
                >
                  <CiPlay1 />
                </button>
              </div>
              <div className="bottom bg-slate-50  flex flex-grow max-w-full ">
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
                  <div className="flex flex-col h-full min-w-96 w-full">
                    <div className="address-bar pr-6">
                      <input
                        type="text"
                        onChange={(e) => setiFrameURL(e.target.value)}
                        value={iframeURL}
                        className="w-full p-2 px-4"
                      />
                    </div>
                    <iframe src={iframeURL} className="w-full  h-full"></iframe>
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
