import MessageList from "./MessageList.tsx";
import MessageInput from "./MessageInput.tsx";
import type { ChatMessage } from "../../../types/chatMessage.ts";
import { ChatBoxStyled } from "./ChatBox.styled.tsx";

type ChatBoxProps = {
  messages: Array<ChatMessage>;
  onSend: (message: string) => void;
};

function ChatBox({ messages, onSend }: ChatBoxProps) {
  return (
    <ChatBoxStyled>
      <h3>Chat</h3>
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </ChatBoxStyled>
  );
}

export default ChatBox;
