import { useState } from "react";
import { MessageInputStyled } from "./ChatBox.styled";

function MessageInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);

    setMessage("");
  };

  return (
    <MessageInputStyled>
      <input
        type={"text"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={"Write a message"}
      />
      <button onClick={handleSend}>Send</button>
    </MessageInputStyled>
  );
}

export default MessageInput;
