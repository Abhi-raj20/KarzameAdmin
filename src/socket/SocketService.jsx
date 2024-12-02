// socketService.js
import io from 'socket.io-client';

// Initialize Socket connection
const socket = io('wss://ws.itracknet.com', {                // wss://ws.itracknet.com  http://api.itracknet.com/ https://node.websocket.karzame.org/  ,    http://ws.itracknet.com/
  transports: ['websocket', 'polling'],
  withCredentials: true
});

// Export any methods needed for handling socket events
export const connectSocket = (onConnect, onDisconnect, onMessage,onUserLiveLocation) => {
  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('message', onMessage);
  socket.on('userLiveLocation', onUserLiveLocation);
};

export const disconnectSocket = () => {
  socket.off('connect');
  socket.off('disconnect');
  socket.off('message');
  socket.off('userLiveLocation')
};

export const sendMessage = (message) => {
  socket.emit('message', message);
};

export const userLiveLocation = (live) => { 
  socket.emit('userLiveLocation', userLiveLocation);
};

// export const userLiveLocation = (message) => {
//   socket.emit('message', message);
// }; 


export default socket;
