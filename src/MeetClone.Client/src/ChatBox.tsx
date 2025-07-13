import { useState } from 'react'

function ChatBox(props: { messageList: Array<string> }) {
    const messageListComponent = props.messageList.map((message, idx) => <li key={idx}>{message}</li>)

    return (
        <>
            <h3>Chat</h3>
            <ul id='chatBoxMessageList'>
                {messageListComponent}
            </ul>
        </>
    )
}

export default ChatBox;