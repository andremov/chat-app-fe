import {useState} from 'react';

export default ({setData}) => {
    const [name, setUsername] = useState('');
    const [room, setRoom] = useState('');
    
    const handleUser = ({target}) => setUsername(target.value)
    const handleRoom = ({target}) => setRoom(target.value)
    const handleLogin = () => {
        setData({name, room})
        setRoom("")
        setUsername("")
    }

    return (
        <div className="flex flex-col gap-4 max-w-xs mx-auto mt-24 p-6 bg-white rounded-lg shadow">
            <input 
                placeholder={"Username"} 
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                value={name} 
                onChange={handleUser}
            />
            <input 
                placeholder={"Room"} 
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                value={room} 
                onChange={handleRoom}
            />
            <button 
                className="bg-blue-500 text-white rounded px-4 py-2 font-semibold hover:bg-blue-600 disabled:bg-gray-300" 
                disabled={!room || !name} 
                onClick={handleLogin}
            >
                Enter
            </button>
        </div>
    )
}