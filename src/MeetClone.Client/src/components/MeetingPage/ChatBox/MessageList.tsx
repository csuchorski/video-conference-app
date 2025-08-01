import type { ChatMessage } from "../../../types/chatMessage.ts";
import { MessageListStyled } from "./ChatBox.styled.tsx";

function MessageList(props: { messages: Array<ChatMessage> }) {
  const messageListComponent = props.messages.map((message, idx) => (
    <li className="message" key={idx}>
      <span className="message-sender">{message.sender}:</span>
      <br />
      <span className="message-content">{message.content}</span>
    </li>
  ));

  return (
    <MessageListStyled>
      <ul id="chatBoxMessageList">{messageListComponent}</ul>
    </MessageListStyled>
  );
}

export default MessageList;
