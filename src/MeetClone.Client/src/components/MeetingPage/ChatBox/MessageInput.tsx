import { useState } from "react";
import { MessageInputStyled } from "./ChatBox.styled";

function MessageInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSend();
    }
  };

  return (
    <MessageInputStyled>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"Write a message"}
        rows={1}
      />
      <button onClick={handleSend}>Send</button>
    </MessageInputStyled>
  );
}

export default MessageInput;
