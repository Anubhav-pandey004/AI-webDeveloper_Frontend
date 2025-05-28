import { io } from 'socket.io-client';


let socketInstance = null;

//socket instance variable is now our path to send msg to backend
//we can emmit any event
export const initializeSocket = (projectId) => {
    if (!socketInstance) {
        
        socketInstance = io('https://ai-webdeveloper-backend.onrender.com', {
            timeout: 20000,
            auth: {
                token: localStorage.getItem('token')  // or document.cookie for cookie-based tokens
            },
            query: {
                projectId
            },
             transports: ['websocket'],
        });        

        socketInstance.on('connection', () => {
             console.log("Connected to socket server", socketInstance.id);
        });

        socketInstance.on('project-message-receive', (data) => {
            console.log("Disconnected from socket server");
        });
        socketInstance.on('connect_error', (err) => {
           console.error("Socket connection error:", err.message);
        });

    }
    return socketInstance;
};


//various events
export const receiveMessage = (eventNames, cb)=>{
    socketInstance.on(eventNames, cb);
}

export const sendMessage = (eventNames, data)=>{    
    socketInstance.emit(eventNames, data);
}



