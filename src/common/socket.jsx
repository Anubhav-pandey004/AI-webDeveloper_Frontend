import { io } from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (!socketInstance) {
        socketInstance = io('https://ai-webdeveloper-backend.onrender.com', {
            auth: {
                token: localStorage.getItem('token') || ''
            },
            query: {
                projectId
            },
            transports: ['websocket'], // enforce WebSocket to avoid polling issues
            withCredentials: true
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        socketInstance.on('project-message-receive', (data) => {
            console.log('Message received:', data);
        });
    }
    return socketInstance;
};
