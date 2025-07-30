import MessageList from "./MessageList.tsx";
import MessageInput from "./MessageInput.tsx";
import type { ChatMessage } from "../../types/chatMessage.ts";

interface ChatBoxProps {
  messages: Array<ChatMessage>;
  onSend: (message: string) => void;
}

function ChatBox({ messages, onSend }: ChatBoxProps) {
  return (
    <>
      <h3>Chat</h3>
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </>
  );
}

export default ChatBox;
