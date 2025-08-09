import { useState, useEffect } from 'react'
import Chat from './components/chat'
import Login from './components/login'
import io from 'socket.io-client';

let socket;
const ENDPOINT = 'ws://localhost:3030';

function App() {
  const [isConnected, setConnected] = useState(false);
  const [userData, setUserData] = useState(undefined);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userData) return;

    const { name, room } = userData;

    socket = io(ENDPOINT, {
      withCredentials: false,
    });


    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
        setUserData(undefined);
      } else {
        setConnected(true);
      }
    });
  }, [ENDPOINT, userData]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (socketMessage) => {
      setMessages((prevMessages) => [...prevMessages, socketMessage]);
    });
  }, [socket]);

  return (
    <>
      {!isConnected && <Login setData={setUserData} />}
      <Chat isConnected={isConnected} messages={messages} socket={socket} />
    </>
  )
}

export default App
