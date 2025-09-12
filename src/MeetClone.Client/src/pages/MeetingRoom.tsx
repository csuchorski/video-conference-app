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
import VideoTile from "../components/MeetingPage/VideoTile";

type MeetingRoomProps = {
  connection: HubConnection | null;
};

export default function MeetingRoom({ connection }: MeetingRoomProps) {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const isConnected = useRef(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);

  // const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [id: string]: MediaStream;
  }>({});
  const peerConnections = useRef<{ [id: string]: RTCPeerConnection }>({});

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

  const createPeerConnection = useCallback(
    (userId: string): RTCPeerConnection => {
      const iceServers: RTCIceServer[] = [
        { urls: "stun:stun.l.google.com:19302" },
      ];

      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnection.onicecandidate = (event) => {
        if (!event.candidate) return;
        connection?.invoke("SendIceCandidate", userId, event.candidate);
      };

      peerConnection.ontrack = (event) => {
        setRemoteStreams((prev) => ({
          ...prev,
          [userId]: event.streams[0],
        }));
      };

      peerConnections.current[userId] = peerConnection;
      return peerConnection;
    },
    [connection]
  );

  const handleReceiveMessage = useCallback((message: ChatMessage) => {
    console.log("Message received");
    setMessages((prevList) => [...prevList, message]);
  }, []);

  const handleNewUserJoined = useCallback(
    async (userId: string) => {
      console.log("New user joined");
      if (!localStream || peerConnections.current[userId]) return;

      const peerConnection = createPeerConnection(userId);
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream!));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      connection?.invoke("SendOffer", userId, offer);
    },
    [connection, createPeerConnection]
  );

  const handleReceiveOffer = useCallback(
    async (fromUserId: string, offer: RTCSessionDescriptionInit) => {
      const peerConnection = createPeerConnection(fromUserId);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      localStream
        ?.getTracks()
        .forEach((track: MediaStreamTrack) =>
          peerConnection.addTrack(track, localStream!)
        );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      connection?.invoke("SendAnswer", fromUserId, answer);
    },
    [connection, createPeerConnection]
  );

  const handleReceiveAnswer = useCallback(
    async (fromUserId: string, answer: RTCSessionDescriptionInit) => {
      peerConnections.current[fromUserId].setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    },
    []
  );

  const handleReceiveIceCandidate = useCallback(
    async (fromUserId: string, candidate: RTCIceCandidateInit) => {
      const peerConnection = peerConnections.current[fromUserId];
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    },
    []
  );

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
  }, [connection, navigate]);

  useEffect(() => {
    if (connection && !isConnected.current && meetingId) {
      joinMeeting();
    }

    return () => {
      if (isConnected.current) {
        leaveMeeting();
      }
    };
  }, [connection, meetingId, joinMeeting, leaveMeeting]);

  useEffect(() => {
    if (!connection) return;

    connection?.on("ReceiveMessage", handleReceiveMessage);
    connection?.on("NewUserJoined", handleNewUserJoined);
    connection?.on("ReceiveOffer", handleReceiveOffer);
    connection?.on("ReceiveAnswer", handleReceiveAnswer);
    connection?.on("ReceiveIceCandidate", handleReceiveIceCandidate);
    return () => {
      connection?.off("ReceiveMessage", handleReceiveMessage);
      connection?.off("NewUserJoined", handleNewUserJoined);
      connection?.off("ReceiveOffer", handleReceiveOffer);
      connection?.off("ReceiveAnswer", handleReceiveAnswer);
      connection?.off("ReceiveIceCandidate", handleReceiveIceCandidate);
    };
  }, [
    connection,
    handleReceiveMessage,
    handleNewUserJoined,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleReceiveIceCandidate,
  ]);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <MeetingRoomStyled>
      <MainContent>
        <VideoContainer>
          <VideoTile
            key={connection?.connectionId}
            stream={localStream}
            userId={connection?.connectionId}
          />
          {Object.entries(remoteStreams).map(([userId, stream]) => (
            <VideoTile key={userId} stream={stream} userId={userId} />
          ))}
        </VideoContainer>
        <MeetingSidebar>
          <ChatBox messages={messages} onSend={sendMessage} />
        </MeetingSidebar>
      </MainContent>
      <MeetingControlBar onLeave={leaveMeeting} />
    </MeetingRoomStyled>
  );
}
