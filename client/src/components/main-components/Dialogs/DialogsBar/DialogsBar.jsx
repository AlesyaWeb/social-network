import React, {useEffect} from 'react';
import {getDialogs} from "../../../../utils/getDialogs";
import classes from "../Dialogs.module.css";
import CreateNewDialog from "../CreateNewDialog/CreateNewDialog";
import {Conversation, ConversationList, Avatar} from "@chatscope/chat-ui-kit-react";

const DialogsBar = (props) => {
    const dialogs = getDialogs(props.dialogsData)
    console.log(props.usersList)
    const dialogsData = dialogs.map(dialog => {
        const user = dialog.users.find(user => user.user !== props.currentUser)
        if(props.usersList.find(friend => friend.user === user.user)) {
            return <Conversation onClick={()=>{props.setCurrentDialog(dialog.room)}} name={user.first_name + ' ' + user.last_name}>
                <Avatar src={user.photo_50} size={"md"} alt={"f"} />
            </Conversation>
        }
        return false
        // <div className={classes.dialog} onClick={()=>props.setCurrentDialog(dialog.room)}>
        //     <img className={classes.dialog__image} src={user.photo_50} alt=""/>
        //     <div className={classes.dialog__name}>{user.first_name + ' ' + user.last_name}</div>
        // </div>
    })

    return (
        <div>
            <ConversationList>
                {dialogsData}
                {props.deviceWidth < 768 &&
                    <CreateNewDialog setCurrentDialog={props.setCurrentDialog}
                                     dialogs={getDialogs(props.dialogsData)}
                                     usersList={props.usersList}
                                     currentUser={props.currentUser}
                                     createNewDialog={props.createNewDialog
                                     }/>
                }
            </ConversationList>
        </div>
    );
};

export default DialogsBar;