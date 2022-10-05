import {useState} from 'react';
import { GrSend } from 'react-icons/gr';

export default ({isConnected, socket, messages}) => {
    const [draft, setDraft] = useState('');
    
    const handleSend = () => {
        socket.emit('sendMessage', draft, () => setDraft(''));
    }
    const handleInput = ({target}) => setDraft(target.value)
    const handleDown = ({key}) => (key === "Enter" ? handleSend() : false) 

    return (
        <div className="chat__container">
            <div className="chat__contents">
                {
                    messages.map((item, index) => (
                        <div 
                            className="chat__msg"
                            key={index}
                        >
                            <div
                                className="chat__msg__user"
                            >
                                {item.user}
                            </div>
                            <div
                                className="chat__msg__text"
                            >
                                {item.text}
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="chat__input-section">
                <input
                    className="chat__input-section__input"
                    value={draft}
                    onChange={handleInput}
                    onKeyDown={handleDown}
                    placeholder="What's up?"
                />
                <button
                    className="chat__input-section__btn"
                    onClick={handleSend}
                    disabled={!isConnected}
                >
                    <GrSend/>
                </button>
            </div>
        </div>
    )
}