import socket from 'socket.io-client';


let socketInstance = null;

//socket instance variable is now our path to send msg to backend
//we can emmit any event
export const initializeSocket = (projectId) => {
    if (!socketInstance) {
        
        socketInstance = socket('http://localhost:8080', {
            auth: {
                token: localStorage.getItem('token')  // or document.cookie for cookie-based tokens
            },
            query: {
                projectId
            }
        });        

        socketInstance.on('connection', () => {

        });

        socketInstance.on('project-message-receive', (data) => {

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



