import React, {useState} from 'react';
import classes from "../Dialogs.module.css";
import {sendMessage} from "../../../../redux/MessagesReducer";
import socket from "../../../../context/socket";

const SendMessageForm = (props) => {
    const [newMessageText, setNewMessageText] = useState("")
    const inputOnChange = (e) => {
        setNewMessageText(e.target.value)
    }
    const handleSubmit = () => {
        const receiverId = props.currentRoom.userIds.find((user) => user !== props.currentUser)
        props.sendMessage(newMessageText, props.currentRoom._id, receiverId)
        socket.emit("sendMessage", {receiverId, newMessageText})
        setNewMessageText("")
    }
    return (
        <div className={classes.sendMessageForm}>
            <input type="text" className={classes.sendMessageForm__input} onChange={inputOnChange} value={newMessageText} />
            <button onClick={handleSubmit} className={classes.sendMessageForm__button} >Send</button>
        </div>
    );
};

export default SendMessageForm;