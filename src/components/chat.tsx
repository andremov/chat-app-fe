import { useEffect, useRef, useState } from 'react';
import { MessageType } from '../utils/types';
import { Send } from 'lucide-react';

type ChatPropsType = {
  connectionState: 'CONNECTING' | 'CONNECTED';
  socket: WebSocket | null;
  messages: MessageType[];
  userData: { name?: string; id?: string };
};

export function Chat({
  connectionState,
  socket,
  messages,
  userData,
}: ChatPropsType) {
  const [draft, setDraft] = useState('');
  const chatRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!socket) return;
    socket.send(JSON.stringify({ type: 'message', payload: { text: draft } }));
    setDraft('');
  };
  const handleInput = ({ target }) => setDraft(target.value);
  const handleDown = ({ key }) => (key === 'Enter' ? handleSend() : false);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  if (!socket || connectionState === 'CONNECTING') {
    return <div className="bg-white p-4 rounded-lg">Connecting...</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-slate-700 rounded-lg shadow pb-4 overflow-hidden">
      <div
        className="h-96 overflow-y-scroll flex flex-col mb-4 px-4 pt-2"
        ref={chatRef}
      >
        {messages.map((item, index, array) => {
          if (item.type === 'error') {
            return (
              <div className="bg-gray-100 rounded-lg p-3 mt-2" key={index}>
                <div className="text-xs font-semibold text-gray-600 mb-1">
                  Error
                </div>
                <div className="text-base text-gray-800">
                  {item.payload.error}
                </div>
              </div>
            );
          } else if (item.type === 'system-message') {
            return (
              <div
                className="bg-gray-500 rounded-lg py-2 px-3 mt-2 w-fit mx-auto"
                key={index}
              >
                <div className="text-xs text-gray-100 text-center">
                  {item.payload.text}
                </div>
              </div>
            );
          } else {
            const prevMessage = array[index - 1];
            const lastMessageIsSameSender =
              prevMessage &&
              prevMessage.type === 'message' &&
              prevMessage.payload.userId === item.payload.userId;

            const nextMessage = array[index + 1];
            const nextMessageIsSameSender =
              nextMessage &&
              nextMessage.type === 'message' &&
              nextMessage.payload.userId === item.payload.userId;
            return (
              <div
                className={`bg-gray-100 rounded-lg p-3 ${lastMessageIsSameSender ? 'mt-1' : 'mt-2'} min-w-32 ${item.payload.userId === userData.id ? 'self-end' : 'self-start'}`}
                key={index}
              >
                {!lastMessageIsSameSender && (
                  <div className="text-xs font-semibold text-gray-600">
                    {item.payload.user}
                  </div>
                )}
                <div
                  className={`text-base text-gray-800 ${!nextMessageIsSameSender ? 'mb-1' : ''}`}
                >
                  {item.payload.text}
                </div>
                {!nextMessageIsSameSender && (
                  <div className="text-xs text-right text-gray-400">
                    {item.timestamp.split('T')[1].split('.')[0]}
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
      <div className="flex items-center gap-2 px-4">
        <input
          className="flex-1 border bg-white border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={draft}
          onChange={handleInput}
          onKeyDown={handleDown}
          placeholder="What's up?"
        />
        <button
          className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
          onClick={handleSend}
          disabled={connectionState !== 'CONNECTED'}
        >
          <Send />
        </button>
      </div>
    </div>
  );
}
