import {useEffect, useState} from 'react'
import * as signalR from '@microsoft/signalr'

import './App.css'
import ChatBox from './ChatBox'
import type {ChatMessage} from "./types.ts";

function App() {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
    const [meetingCode, setMeetingCode] = useState<string>('')
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [messageList, setMessageList] = useState<Array<ChatMessage>>([])


    useEffect(() => {
            if (!connection) {
                const newConnection = new signalR.HubConnectionBuilder()
                    .withUrl("https://localhost:7034/meetingHub", {})
                    .build()

                setConnection(newConnection)

                newConnection.start()
                    .then(() => {
                        console.log("connected to the hub")
                        newConnection.on("ReceiveMessage", (sender: string, content: string) => handleReceiveMessage({
                                sender: sender,
                                content: content
                            })
                        )
                    })
                    .catch(e => console.log("connection failed: ", e))
            }
        }

        ,
        [connection]
    )
    ;

    const toggleConnect = () => {
        if (isConnected) {
            leaveMeeting()
        } else {
            joinMeeting()
        }

    }

    const joinMeeting = () => {
        connection?.invoke("JoinMeeting", connection.connectionId, meetingCode).then(() => {
            setIsConnected(true)
        })

    }

    const leaveMeeting = () => {
        connection?.invoke("LeaveMeeting", connection.connectionId, meetingCode).then(() => {
            setIsConnected(false)
        })
    }

    const handleReceiveMessage = (message: ChatMessage) => {
        setMessageList(prevList => [...prevList, message])
    }

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
            <ChatBox messageList={messageList}/>


        </>
    )
}

export default App
