import { useCallback, useEffect, useRef, useState } from "react";
import ChatBox from "../components/MeetingPage/ChatBox/ChatBox";
import type { ChatMessage } from "../types/chatMessage";
import { HubConnectionState, type HubConnection } from "@microsoft/signalr";
import { useNavigate, useParams } from "react-router";
import MeetingRoomStyled from "./MeetingRoom.styled";
import { VideoContainer } from "../components/MeetingPage/VideoContainer.styled";
import MeetingControlBar from "../components/MeetingPage/MeetingControlBar";
import { MainContent } from "../components/MeetingPage/MainContent.styled";
import { MeetingSidebar } from "../components/MeetingPage/MeetingSidebar.styled";

type MeetingRoomProps = {
  connection: HubConnection | null;
};

export default function MeetingRoom({ connection }: MeetingRoomProps) {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const isConnected = useRef(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);

  const joinMeeting = useCallback(() => {
    if (!connection || !meetingId) return;

    console.log("Joining meeting");

    connection
      ?.invoke("JoinMeeting", connection.connectionId, meetingId)
      .then(() => {
        isConnected.current = true;
      });
  }, [connection, meetingId]);

  const leaveMeeting = useCallback(() => {
    if (!connection || !meetingId || !isConnected.current) return;

    console.log("Leaving meeting");

    connection
      ?.invoke("LeaveMeeting", connection.connectionId, meetingId)
      .then(() => {
        isConnected.current = false;
        navigate("/");
      });
  }, [connection, meetingId, isConnected, navigate]);

  const handleReceiveMessage = useCallback((message: ChatMessage) => {
    console.log("Message received");
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

    if (!isConnected.current) {
      joinMeeting();
    }

    connection?.on("ReceiveMessage", handleReceiveMessage);

    return () => {
      connection?.off("ReceiveMessage", handleReceiveMessage);
      leaveMeeting();
    };
  }, [
    connection,
    meetingId,
    isConnected,
    navigate,
    joinMeeting,
    leaveMeeting,
    handleReceiveMessage,
  ]);

  return (
    <MeetingRoomStyled>
      <MainContent>
        <VideoContainer></VideoContainer>
        <MeetingSidebar>
          <ChatBox messages={messages} onSend={sendMessage} />
        </MeetingSidebar>
      </MainContent>
      <MeetingControlBar onLeave={leaveMeeting} />
    </MeetingRoomStyled>
  );
}
