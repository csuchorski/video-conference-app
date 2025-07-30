import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox/ChatBox";
import type { ChatMessage } from "../types/chatMessage";
import type { HubConnection } from "@microsoft/signalr";
import { useParams } from "react-router";

interface MeetingRoomProps {
  connection: HubConnection;
}

export default function MeetingRoom({ connection }: MeetingRoomProps) {
  const { meetingId } = useParams();
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const joinMeeting = () => {
    connection
      ?.invoke("JoinMeeting", connection.connectionId, meetingId)
      .then(() => {
        setIsConnected(true);
      });
  };

  const leaveMeeting = () => {
    connection
      ?.invoke("LeaveMeeting", connection.connectionId, meetingId)
      .then(() => {
        setIsConnected(false);
      });
  };

  const handleReceiveMessage = (message: ChatMessage) => {
    setMessages((prevList) => [...prevList, message]);
  };

  const sendMessage = (message: string) => {
    connection?.invoke(
      "SendMessageToMeeting",
      connection?.connectionId,
      meetingId,
      message
    );
  };

  useEffect(() => {
    connection.on("ReceiveMessage", (sender: string, content: string) =>
      handleReceiveMessage({
        sender: sender,
        content: content,
      })
    );
  });

  return (
    <>
      <ChatBox messages={messages} onSend={sendMessage} />
    </>
  );
}
