import React, {useEffect, useState} from "react";
import classes from './Dialogs.module.css';
import DialogsBar from "./DialogsBar/DialogsBar";
import Messages from "./Messages/Messages";
import SendMessageForm from "./SendMessageForm/SendMessageForm";
import DialogInfo from "./dialogInfo/dialogInfo";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer
} from "@chatscope/chat-ui-kit-react";
import {Avatar} from "@mui/material";
import CreateNewDialog from "./CreateNewDialog/CreateNewDialog";
import {getDialogs} from "../../../utils/getDialogs";
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
const Dialogs = (props) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const currentRoom = props.dialogsData.rooms.find((room) => room._id === props.currentRoom)
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        // жалкая попытка адптировать под телефоны
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    console.log(windowDimensions.width < 768)
    return (
        <div className={classes.dialogs_wrapper}>
            <MainContainer>
                {!props.currentRoom && windowDimensions.width < 768 &&
                    <DialogsBar dialogsData={props.dialogsData}
                                setCurrentDialog={props.setCurrentDialog}
                                currentUser={props.currentUser}
                                deviceWidth={windowDimensions.width}
                                usersList={props.usersList}
                                createNewDialog={props.createNewDialog}
                    />
                }
                {windowDimensions.width >=768 &&
                    <DialogsBar dialogsData={props.dialogsData}
                                setCurrentDialog={props.setCurrentDialog}
                                currentUser={props.currentUser}
                                usersList={props.usersList}
                                createNewDialog={props.createNewDialog}
                    />
                }
                {!props.currentRoom && windowDimensions.width >= 768 &&  <div>Choose a conversation to communicate</div>}
                {props.currentRoom &&
                    <Messages addMessage={props.addMessage}
                              convIsFetching={props.convIsFetching}
                              currentRoom={currentRoom}
                              currentUser={props.currentUser}
                              setCurrentDialog={props.setCurrentDialog}
                              messagesData={props.messagesData}
                              sendMessage={props.sendMessage}
                              usersList={props.usersList}
                              deviceWidth={windowDimensions.width}
                              onlineUsersList={props.onlineUsersList}
                              setMessagesData={props.setMessagesData} />
                }
            </MainContainer>
            {windowDimensions.width >= 768 &&
                <CreateNewDialog setCurrentDialog={props.setCurrentDialog}
                                 dialogs={getDialogs(props.dialogsData)}
                                 usersList={props.usersList}
                                 currentUser={props.currentUser}
                                 createNewDialog={props.createNewDialog
                                 }/>
            }
        </div>
    )

}
export default Dialogs;
