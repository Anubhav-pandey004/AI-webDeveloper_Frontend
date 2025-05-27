import formatFile from "./formatFile";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
const RunProject = async ({
  fileTree,
  runProcess,
  setRunProcess,
  webContainer,
  commands,
  setiFrameURL,
  terminalRef,
}) => {
  try {
    let formattedFileTree = formatFile(fileTree);

    await webContainer?.mount(formattedFileTree);

    // Extract commands from the provided `commands` object
    const frontendBuildCmd = commands?.buildCommand?.frontend
      ? [
          commands.buildCommand.frontend.mainItem,
          ...commands.buildCommand.frontend.commands,
        ]
      : ["npm", "run", "build"];

    const frontendStartCmd = commands?.startCommand?.frontend
      ? [
          commands.startCommand.frontend.mainItem,
          ...commands.startCommand.frontend.commands,
        ]
      : ["npm", "run", "dev"];

    const backendBuildCmd = commands?.buildCommand?.backend
      ? [
          commands.buildCommand.backend.mainItem,
          ...commands.buildCommand.backend.commands,
        ]
      : ["npm", "run", "build"];

    const backendStartCmd = commands?.startCommand?.backend
      ? [
          commands.startCommand.backend.mainItem,
          ...commands.startCommand.backend.commands,
        ]
      : ["npm", "start"];

    // Check if frontend and backend exist in the file tree
    const frontendExists = Object.keys(fileTree).includes("frontend");
    const backendExists = Object.keys(fileTree).includes("backend");

    //creating Terminal
    if (!terminalRef.current) return;

    const terminal = new Terminal({
      convertEol: true,
      cursorBlink: true,
    });

    terminal.open(terminalRef.current);

    async function startShell(terminal) {
      const shellProcess = await webContainer.spawn("jsh"); // ✅ Ensure WebContainer instance is used

      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

      const input = shellProcess.input.getWriter();

      terminal.onData((data) => {
        input.write(data); // ✅ Correctly send input data to the process
      });

      return shellProcess;
    }

    // Install dependencies for frontend if it exists in the file tree

    if (frontendExists) {
      
      terminal.write("Installing frontend dependencies...\n");
      const frontendInstallProcess = await webContainer?.spawn(
        "npm",
        ["install"],
        { cwd: "/frontend" }
      );
      await frontendInstallProcess?.exit;
    } else {
      terminal.write(
        "Frontend directory not found in file tree, skipping frontend dependencies installation.\n"
      );

    }

    // Install dependencies for backend if it exists in the file tree
    if (backendExists) {
      
      terminal.write("Installing backend dependencies...\n");
      const backendInstallProcess = await webContainer?.spawn(
        "npm",
        ["install"],
        { cwd: "/backend" }
      );
      await backendInstallProcess?.exit;
    } else {
      terminal.write(
        "Backend directory not found in file tree, skipping backend dependencies installation.\n"
      );


    }

    // Build frontend if buildCommand exists and frontend directory exists

    if (frontendExists && frontendBuildCmd.length) {
      terminal.write("Building frontend...\n");
      
      const frontendBuildProcess = await webContainer?.spawn(
        frontendBuildCmd[0],
        frontendBuildCmd.slice(1),
        { cwd: "/frontend" }
      );
      await frontendBuildProcess.exit;
    }

    // Build backend if buildCommand exists and backend directory exists
    if (backendExists && backendBuildCmd.length) {
      terminal.write("Building backend...\n");
    
      const backendBuildProcess = await webContainer?.spawn(
        backendBuildCmd[0],
        backendBuildCmd.slice(1),
        { cwd: "/backend" }
      );
      await backendBuildProcess?.exit;
    }

    // Kill any running process
    // Kill any previous running processes safely
    if (Array.isArray(runProcess)) {
      runProcess.forEach((proc) => proc?.kill?.());
    }

    let frontendRunProcess;
    if (frontendExists) {
      terminal.write("Starting frontend server...\n");
      frontendRunProcess = await webContainer?.spawn(
        frontendStartCmd[0],
        frontendStartCmd.slice(1),
        { cwd: "/frontend" }
      );
      frontendRunProcess.output.pipeTo(
        new WritableStream({
          write: (data) => {
            // console.log("Frontend:", data)
            terminal.write(`Frontend: ${data}`);
          },
        })
      );
    }

    // Start backend server if it exists
    let backendRunProcess;
    if (backendExists) {
      terminal.write("Starting backend server...\n");

      backendRunProcess = await webContainer?.spawn(
        backendStartCmd[0],
        backendStartCmd.slice(1),
        { cwd: "/backend" }
      );
      backendRunProcess?.output.pipeTo(
        new WritableStream({
          write: (data) => {
            // console.log("Backend:", data)
            terminal.write(`Backend: ${data}`);
          },
        })
      );
    }

    // Store the process references
    setRunProcess([frontendRunProcess, backendRunProcess]);

    webContainer?.on("server-ready", (port, url) => {
      terminal.write(`Server is ready on port ${port}: ${url}\n`);
      

      if (port != 3000) {
        terminal.write("Frontend detected!\n");
        
        setiFrameURL(url); // Set the frontend URL
      } else {
        terminal.write("Backend detected!\n");
        
        setiFrameURL(url);
      }
    });
    startShell(terminal);
  } catch (error) {
    console.error("Error running project:", error);
  }
};

export default RunProject;



