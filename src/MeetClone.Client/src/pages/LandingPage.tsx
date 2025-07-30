import type { HubConnection } from "@microsoft/signalr";
import { useState } from "react";

export default function LandingPage() {
  const [meetingCode, setMeetingCode] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const toggleConnect = () => {
    if (!isConnected) {
      joinMeeting();
    }
  };

  const joinMeeting = () => {
    connection
      ?.invoke("JoinMeeting", connection.connectionId, meetingCode)
      .then(() => {
        setIsConnected(true);
      });
  };

  const leaveMeeting = () => {
    connection
      ?.invoke("LeaveMeeting", connection.connectionId, meetingCode)
      .then(() => {
        setIsConnected(false);
      });
  };

  return (
    <>
      <h1>Meeting client</h1>
      <div>
        <label htmlFor="meetingPin">Enter Meeting Pin:</label>
        <input
          type="text"
          id="meetingPin"
          value={meetingCode}
          onChange={(e) => setMeetingCode(e.target.value)}
          placeholder="Enter pin"
        />
        <button onClick={toggleConnect}>
          {!isConnected ? "Connect" : "Disconnect"}
        </button>
      </div>
    </>
  );
}
