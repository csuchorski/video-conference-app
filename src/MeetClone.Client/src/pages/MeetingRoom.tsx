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

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [id: string]: MediaStream;
  }>({});

  const videoTiles = Object.entries(remoteStreams).map(([userId, stream]) => (
    <VideoTile key={userId} stream={stream} userId={userId} />
  ));

  const columns = Math.ceil(Math.sqrt(videoTiles.length + 1));
  const rows = Math.ceil((videoTiles.length + 1) / columns);

  const peerConnections = useRef<{ [id: string]: RTCPeerConnection }>({});

  const joinMeeting = useCallback(() => {
    if (!connection || !meetingId || !localStream) return;

    console.log("Joining meeting");

    connection
      ?.invoke("JoinMeeting", connection.connectionId, meetingId)
      .then(() => {
        isConnected.current = true;
      });
  }, [localStream, connection, meetingId]);

  const leaveMeeting = useCallback(() => {
    if (
      connection &&
      connection.state == HubConnectionState.Connected &&
      meetingId &&
      isConnected.current
    ) {
      connection
        ?.invoke("LeaveMeeting", connection.connectionId, meetingId)
        .then(() => {
          isConnected.current = false;
          navigate("/");
        })
        .catch((e: Error) => {
          console.error(e.message);
        });
    }
  }, [connection, meetingId, isConnected, navigate]);

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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (connection && meetingId && isConnected.current) {
        leaveMeeting();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  const createPeerConnection = useCallback(
    (userId: string): RTCPeerConnection => {
      const iceServers: RTCIceServer[] = [
        { urls: "stun:stun.l.google.com:19302" },
      ];

      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          connection?.invoke("SendIceCandidate", userId, event.candidate);
        }
      };

      peerConnection.ontrack = (event: RTCTrackEvent) => {
        // console.log("Received remote track");
        setRemoteStreams((prev) => ({
          ...prev,
          [userId]: event.streams[0],
        }));
      };

      peerConnection.onnegotiationneeded = () => {
        peerConnection
          .createOffer()
          .then((offer) => peerConnection.setLocalDescription(offer))
          .then(() => {
            connection?.invoke("SendOffer", userId, {
              type: peerConnection.localDescription?.type,
              sdp: peerConnection.localDescription?.sdp,
            });
          })
          .catch((err) => console.log(err));
      };
      peerConnections.current[userId] = peerConnection;
      return peerConnection;
    },
    [connection]
  );
  const handleReceiveMessage = useCallback((message: ChatMessage) => {
    // console.log("Message received");
    setMessages((prevList) => [...prevList, message]);
  }, []);

  const handleNewUserJoined = useCallback(
    async (userId: string) => {
      //   console.log("New user joined");
      if (!localStream || peerConnections.current[userId]) return;

      const peerConnection = createPeerConnection(userId);
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));
    },
    [createPeerConnection, localStream]
  );

  const handleUserLeft = useCallback(async (userId: string) => {
    if (!peerConnections.current[userId]) return;

    delete peerConnections.current[userId];
    setRemoteStreams((prev) => {
      const newStreams = { ...prev };
      delete newStreams[userId];
      return newStreams;
    });
  }, []);

  const handleReceiveOffer = useCallback(
    async (fromUserId: string, offer: RTCSessionDescriptionInit) => {
      //   console.log("Received Offer");
      const peerConnection = createPeerConnection(fromUserId);
      await peerConnection
        .setRemoteDescription(offer)
        .then(() => {
          localStream?.getTracks().forEach((track: MediaStreamTrack) => {
            // console.log("Adding a track to answer");
            peerConnection.addTrack(track, localStream);
          });
        })
        .then(() => peerConnection.createAnswer())
        .then((answer) => peerConnection.setLocalDescription(answer))
        .then(() => {
          connection?.invoke("SendAnswer", fromUserId, {
            type: peerConnection.localDescription?.type,
            sdp: peerConnection.localDescription?.sdp,
          });
        })
        .catch((err) => console.log(err));
    },
    [connection, createPeerConnection, localStream]
  );

  const handleReceiveAnswer = useCallback(
    async (fromUserId: string, answer: RTCSessionDescriptionInit) => {
      //   console.log("Received answer");
      peerConnections.current[fromUserId].setRemoteDescription(answer);
    },
    []
  );

  const handleReceiveIceCandidate = useCallback(
    async (fromUserId: string, candidateInit: RTCIceCandidateInit) => {
      const peerConnection = peerConnections.current[fromUserId];
      if (peerConnection) {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(candidateInit)
        );
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
  }, [connection, meetingId, isConnected, joinMeeting, leaveMeeting]);

  useEffect(() => {
    if (!connection) return;

    connection?.on("ReceiveMessage", handleReceiveMessage);
    connection?.on("NewUserJoined", handleNewUserJoined);
    connection?.on("UserLeft", handleUserLeft);
    connection?.on("ReceiveOffer", handleReceiveOffer);
    connection?.on("ReceiveAnswer", handleReceiveAnswer);
    connection?.on("ReceiveIceCandidate", handleReceiveIceCandidate);
    return () => {
      connection?.off("ReceiveMessage", handleReceiveMessage);
      connection?.off("NewUserJoined", handleNewUserJoined);
      connection?.off("UserLeft", handleUserLeft);
      connection?.off("ReceiveOffer", handleReceiveOffer);
      connection?.off("ReceiveAnswer", handleReceiveAnswer);
      connection?.off("ReceiveIceCandidate", handleReceiveIceCandidate);
    };
  }, [
    connection,
    handleReceiveMessage,
    handleNewUserJoined,
    handleUserLeft,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleReceiveIceCandidate,
  ]);

  return (
    <MeetingRoomStyled>
      <MainContent>
        <VideoContainer columns={columns} rows={rows}>
          <VideoTile
            key={connection?.connectionId}
            stream={localStream}
            userId={connection?.connectionId}
          />
          {videoTiles}
        </VideoContainer>
        <MeetingSidebar>
          <ChatBox messages={messages} onSend={sendMessage} />
        </MeetingSidebar>
      </MainContent>
      <MeetingControlBar onLeave={leaveMeeting} />
    </MeetingRoomStyled>
  );
}
