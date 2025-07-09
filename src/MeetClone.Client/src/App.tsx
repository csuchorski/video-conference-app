import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'

import './App.css'

function App() {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7034/meetingHub", {})
      .build()

    setConnection(newConnection)

    newConnection.start()
      .then(() => {
        console.log("connected to the hub")

        newConnection.on("ReceiveMessage", (message: string) => {
          console.log("received message: ", message)
        });
      })
      .catch(e => console.log("connection failed: ", e))
  }, []);

  return (
    <>



    </>
  )
}

export default App
