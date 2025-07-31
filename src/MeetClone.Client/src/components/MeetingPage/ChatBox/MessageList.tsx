import type { ChatMessage } from "../../../types/chatMessage.ts";
import { MessageListStyled } from "./ChatBox.styled.tsx";

function MessageList(props: { messages: Array<ChatMessage> }) {
  const messageListComponent = props.messages.map((message, idx) => (
    <li key={idx}>
      {message.sender}: {message.content}
    </li>
  ));

  return (
    <MessageListStyled>
      <ul id="chatBoxMessageList">{messageListComponent}</ul>
    </MessageListStyled>
  );
}

export default MessageList;
