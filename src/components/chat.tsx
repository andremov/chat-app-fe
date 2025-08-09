import { useState } from "react";
import { GrSend } from "react-icons/gr";

export default ({ isConnected, socket, messages }) => {
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    socket.emit("sendMessage", draft, () => setDraft(""));
  };
  const handleInput = ({ target }) => setDraft(target.value);
  const handleDown = ({ key }) => (key === "Enter" ? handleSend() : false);

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-white rounded-lg shadow p-4">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
        {messages.map((item, index) => (
          <div className="bg-gray-100 rounded-lg p-3 mb-2" key={index}>
            <div className="text-xs font-semibold text-gray-600 mb-1">{item.user}</div>
            <div className="text-base text-gray-800">{item.text}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={draft}
          onChange={handleInput}
          onKeyDown={handleDown}
          placeholder="What's up?"
        />
        <button
          className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
          onClick={handleSend}
          disabled={!isConnected}
        >
          <GrSend />
        </button>
      </div>
    </div>
  );
};
