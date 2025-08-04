import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import * as signalR from "@microsoft/signalr";
import { ThemeProvider } from "styled-components";

import LandingPage from "./pages/LandingPage.tsx";
import MeetingRoom from "./pages/MeetingRoom.tsx";
import GlobalStyle from "./GlobalStyle.ts";
import { theme } from "./theme.ts";

function App() {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    if (!connection) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5175/meetingHub", {})
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
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
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/meeting/:meetingId"
              element={<MeetingRoom connection={connection} />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
