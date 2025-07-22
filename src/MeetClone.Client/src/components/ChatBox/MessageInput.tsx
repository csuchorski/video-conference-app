import {useState} from "react";

function MessageInput({onSend}: { onSend: (message: string) => void }) {
    const [message, setMessage] = useState('');

    const handleSend =
        () => {
            if (!message.trim()) return;
            onSend(message);

            setMessage('');
        }

    return (
        <>
            <input
                type={'text'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={'Write a message'}
            />
            <button onClick={handleSend}>Send</button>

        </>
    )
}

export default MessageInput