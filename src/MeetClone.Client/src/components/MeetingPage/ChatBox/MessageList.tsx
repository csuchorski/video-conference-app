import { useEffect, useRef } from "react";
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

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageListComponent]);

  return (
    <MessageListStyled>
      <ul id="chatBoxMessageList">{messageListComponent}</ul>
      <div ref={messagesEndRef} />
    </MessageListStyled>
  );
}

export default MessageList;
