import { useCallback, useEffect, useState } from "react";
import ChatBox from "../components/ChatBox/ChatBox";
import type { ChatMessage } from "../types/chatMessage";
import { HubConnectionState, type HubConnection } from "@microsoft/signalr";
import { useNavigate, useParams } from "react-router";

interface MeetingRoomProps {
  connection: HubConnection | null;
}

export default function MeetingRoom({ connection }: MeetingRoomProps) {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);

  const joinMeeting = useCallback(() => {
    if (!connection || !meetingId || isConnected) return;

    connection
      ?.invoke("JoinMeeting", connection.connectionId, meetingId)
      .then(() => {
        setIsConnected(true);
      });
  }, [connection, meetingId, isConnected]);

  const leaveMeeting = useCallback(() => {
    if (!connection || !meetingId || !isConnected) return;

    connection
      ?.invoke("LeaveMeeting", connection.connectionId, meetingId)
      .then(() => {
        setIsConnected(false);
      });
  }, [connection, meetingId, isConnected]);

  const handleReceiveMessage = useCallback((message: ChatMessage) => {
    setMessages((prevList) => [...prevList, message]);
  }, []);

  const sendMessage = useCallback(
    (message: string) => {
      connection?.invoke(
        "SendMessageToMeeting",
        connection?.connectionId,
        meetingId,
        message
      );
    },
    [connection, meetingId]
  );

  useEffect(() => {
    if (!connection || connection.state !== HubConnectionState.Connected) {
      console.log("No connection in MeetingRoom");
      navigate("/");
      return;
    }

    joinMeeting();

    connection?.on("ReceiveMessage", handleReceiveMessage);

    return () => {
      connection?.off("ReceiveMessage", handleReceiveMessage);
      leaveMeeting();
    };
  }, [
    connection,
    meetingId,
    navigate,
    isConnected,
    joinMeeting,
    leaveMeeting,
    handleReceiveMessage,
  ]);

  return (
    <>
      <ChatBox messages={messages} onSend={sendMessage} />
    </>
  );
}
