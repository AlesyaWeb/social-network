import React, {useEffect, useRef, useState} from 'react';
import classes from "../Dialogs.module.css";
import {format} from "timeago.js"
import socket from "../../../../context/socket";
import {
    Message,
    MessageList,
    Avatar,
    ChatContainer,
    MessageGroup,
    MessageInput,
    ConversationHeader
} from "@chatscope/chat-ui-kit-react";
const Messages = (props) => {
    const scrollRef = useRef()
    const [arrivalMessage, setArrivalMessage] = useState(null)
    console.log(props)
    const companionId = props.currentRoom.userIds.find(user => user !== props.currentUser)
    const companion = props.usersList.find(user => user.user === companionId)
    const isCompanionOnline = props.onlineUsersList.includes(companionId)
    useEffect(() => {
        socket.on('getMessage', (newMessageText) => {
            setArrivalMessage(newMessageText)
        })
    }, [socket])
    useEffect(() => {
        props.setMessagesData(props.currentRoom._id, "getMessage")
        setArrivalMessage("")
    }, [arrivalMessage])
    useEffect(() => {
        props.setMessagesData(props.currentRoom._id, "loadMessages")
    }, [props.currentRoom])
    const handleSubmit = (textContent) => {
        const receiverId = props.currentRoom.userIds.find((user) => user !== props.currentUser)
        props.sendMessage(textContent, props.currentRoom._id, receiverId)
        socket.emit("sendMessage", {receiverId, textContent})
    }
    const messages = props.messagesData.map((messageEl, key) => {
        const sender = messageEl.sentBy.first_name + ' ' + messageEl.sentBy.last_name
        const isOwnMessage = (messageEl.sentBy.user === props.currentUser)
        const message = messageEl.message
        const sender_avatar = messageEl.sentBy.photo_50
        const sentTime = format(messageEl.createdAt)
        return <>
            <MessageGroup
                direction={isOwnMessage ? "incoming" : "outgoing"}
                sender={sender}
            >
                <Avatar src={sender_avatar} name="avatar" />
                <MessageGroup.Messages>
                    <Message key={key} model={{
                        message: message,
                    }} />
                </MessageGroup.Messages>
                <MessageGroup.Footer>{sentTime}</MessageGroup.Footer>
            </MessageGroup>
        </>
    })
    useEffect(()=>{
        scrollRef?.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])
    return (
        <ChatContainer>
            {props.deviceWidth < 768 ?
                <ConversationHeader>
                    <ConversationHeader.Back onClick={() => (props.setCurrentDialog(false))} />
                    <Avatar src={companion.photo_50} name="Joe" status={isCompanionOnline ? "available" : "unavailable"} />
                    <ConversationHeader.Content userName={companion.first_name + ' ' + companion.last_name} />
                </ConversationHeader> :
                <ConversationHeader>
                    <ConversationHeader />
                    <Avatar src={companion.photo_50} name="Joe" status={isCompanionOnline ? "available" : "unavailable"} />
                    <ConversationHeader.Content userName={companion.first_name + ' ' + companion.last_name} />
                </ConversationHeader>
            }
            <MessageList>
                {messages}
            </MessageList>
            <MessageInput onSend={handleSubmit} attachButton={false} placeholder="Type message here" />
        </ChatContainer>
    );
};
// <div>
//     {props.convIsFetching &&
//         <div>Загрузка сообщений</div>
//     }
//     {!props.convIsFetching &&
//         <>
//             {messages}
//             <div ref={scrollRef}></div>
//         </>
//
//     }
// </div>
export default Messages;