import React from 'react';
import classes from "../Dialogs.module.css";

const DialogInfo = (props) => {
    const companionId = props.currentRoom.userIds.find(user => user !== props.currentUser)
    const companion = props.usersList.find(user => user.user === companionId)
    const isCompanionOnline = props.onlineUsersList.includes(companionId)
    return (
        <div className={classes.dialogUserInfo}>
            <img src={companion.photo_50} className={classes.dialogUserInfo__avatar}></img>
            <div className={classes.dialogUserInfo__name}>{companion.first_name + ' ' + companion.last_name}</div>
            <div className={classes.dialogUserInfo__status}>
                {isCompanionOnline &&
                    <div className={classes.dialogUserInfo__status_online}></div>
                }
                {!isCompanionOnline &&
                    <div className={classes.dialogUserInfo__status_offline}></div>
                }
            </div>
        </div>
    );
};

export default DialogInfo;