import { useState } from 'react';

type LoginPropsType = {
  onLogin: (name: string) => void;
};

export function Login({ onLogin: setData }: LoginPropsType) {
  const [name, setUsername] = useState('');

  const handleUser = ({ target }) => setUsername(target.value);
  const handleLogin = () => {
    setData(name);
    setUsername('');
  };

  return (
    <div className="flex flex-col gap-4 max-w-xs mx-auto p-6 bg-white rounded-lg shadow">
      <input
        placeholder={'Username'}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={name}
        onChange={handleUser}
      />
      <button
        className="bg-blue-500 text-white rounded px-4 py-2 font-semibold hover:bg-blue-600 disabled:bg-gray-300 cursor-pointer"
        disabled={!name}
        onClick={handleLogin}
      >
        Enter
      </button>
    </div>
  );
}
