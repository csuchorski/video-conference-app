import { useState } from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const [meetingCode, setMeetingCode] = useState<string>("");
  const navigate = useNavigate();
  const connectToMeeting = () => {
    navigate(`/meeting/${meetingCode}`);
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
        <button onClick={connectToMeeting}>Connect</button>
      </div>
    </>
  );
}
