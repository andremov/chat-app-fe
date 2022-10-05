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
        <div className="login__container">
            <input placeholder={"Username"} className={"login__input"} value={name} onChange={handleUser}/>
            <input placeholder={"Room"} className={"login__input"} value={room} onChange={handleRoom}/>
            <button className={"login__btn"} disabled={!room || !name} onClick={handleLogin}>
                Enter
            </button>
        </div>
    )
}