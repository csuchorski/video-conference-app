import type {ChatMessage} from '../types.ts';

function MessageList(props: { messageList: Array<ChatMessage> }) {
    const messageListComponent = props.messageList.map((message, idx) => <li
        key={idx}>{message.sender}: {message.content}</li>)

    return (
        <>
            <h3>Chat</h3>
            <ul id='chatBoxMessageList'>
                {messageListComponent}
            </ul>
        </>
    )
}

export default MessageList;