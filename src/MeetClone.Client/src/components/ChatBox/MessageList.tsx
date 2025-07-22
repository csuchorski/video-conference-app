import type {ChatMessage} from '../../types/chatMessage.ts';

function MessageList(props: { messages: Array<ChatMessage> }) {
    const messageListComponent = props.messages.map((message, idx) => <li
        key={idx}>{message.sender}: {message.content}</li>)

    return (
        <>
            <ul id='chatBoxMessageList'>
                {messageListComponent}
            </ul>
        </>
    )
}

export default MessageList;