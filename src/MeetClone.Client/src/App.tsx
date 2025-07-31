import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import * as signalR from "@microsoft/signalr";

import LandingPage from "./pages/LandingPage.tsx";
import MeetingRoom from "./pages/MeetingRoom.tsx";

function App() {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    if (!connection) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7034/meetingHub", {})
        .build();

      newConnection
        .start()
        .then(() => {
          console.log("connected to the hub");
        })
        .catch((e) => console.log("connection failed: ", e));

      setConnection(newConnection);
    }
  }, [connection]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/meeting/:meetingId"
          element={<MeetingRoom connection={connection} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
