import { useState, useEffect, useRef } from 'react';
import { Chat } from './components/chat';
import { Login } from './components/login';
import { MessageType } from './utils/types';

const ENDPOINT = 'ws://localhost:8080';

enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}

function App() {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED,
  );
  const [userData, setUserData] = useState<{
    id: string | undefined;
    name: string | undefined;
  }>({ id: undefined, name: undefined });
  const [messages, setMessages] = useState<MessageType[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const setConnecting = () => setConnectionState(ConnectionState.CONNECTING);
  const setDisconnected = () =>
    setConnectionState(ConnectionState.DISCONNECTED);
  const setConnected = () => setConnectionState(ConnectionState.CONNECTED);

  useEffect(() => {
    if (connectionState === ConnectionState.DISCONNECTED) return;

    if (connectionState === ConnectionState.CONNECTED) {
      return () => {
        console.log('[useEffect] Closing websocket.');

        wsRef.current?.close();
      };
    }

    console.log('[useEffect] Connecting...');

    if (!wsRef.current) {
      wsRef.current = new WebSocket(ENDPOINT);
    }

    let wsInstance = wsRef.current;

    wsInstance.onopen = () => {
      console.log('[useEffect] WebSocket connected.');
      wsInstance.send(JSON.stringify({ type: 'join', payload: userData }));
      setConnected();
      setMessages([]); // Clear messages on new connection
    };

    wsInstance.onmessage = (event) => {
      console.log('[useEffect] WebSocket message received.');
      try {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === 'error') {
          alert(data.message);
          setUserData({ name: undefined, id: undefined });
          setDisconnected();
          wsInstance.close();
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'error', payload: { error: event.data } } as MessageType,
          ]);
        } else if (data.type === 'message') {
          setMessages((prevMessages) => [...prevMessages, data]);
        } else if (data.type === 'system-message') {
          if (data.payload.userId) {
            setUserData((prev) => ({ ...prev, id: data.payload.userId }));
            setConnected();
          }
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      } catch (e) {
        // fallback: treat as plain message
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'error', payload: { error: event.data } } as MessageType,
        ]);
      }
    };

    wsInstance.onerror = () => {
      alert('WebSocket error');
      setUserData({ name: undefined, id: undefined });
      setDisconnected();
    };

    wsInstance.onclose = () => {
      setDisconnected();
    };
  }, [connectionState]);

  // No need for a separate effect for messages; handled in wsInstance.onmessage

  return (
    <main className="bg-slate-900 w-screen h-screen flex items-center justify-center">
      {connectionState === ConnectionState.DISCONNECTED && (
        <Login
          onLogin={(userName: string) => {
            setUserData({ name: userName, id: undefined });
            setConnecting();
          }}
        />
      )}
      {connectionState !== ConnectionState.DISCONNECTED && (
        <Chat
          userData={userData}
          connectionState={connectionState}
          messages={messages}
          socket={wsRef.current}
        />
      )}
    </main>
  );
}

export default App;
