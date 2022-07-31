import React, {useState} from 'react';
import classes from "../Dialogs.module.css";

const CreateNewDialog = (props) => {
    const [usersList, setUsersList] = useState(false)
    const users = props.usersList.map( el => props.currentUser !== el.user && <div className={classes.usersList__item} onClick={()=>{
        props.createNewDialog(el.user).then(response => {
            if(response) props.setCurrentDialog(response.data.chatRoomId)
            else alert('Error')
        })
    }}>
        <img src={el.photo_50} alt="avatar" className={classes.usersList__item__image}/>
        <div>{el.first_name + ' ' + el.last_name}</div>
    </div> )
    return (
        <div onBlur={()=>setUsersList(false)} tabIndex="1" className={classes.createNewDialogWrapper}>
            <div className={classes.createNewDialog} onClick={() => setUsersList(!usersList)}>
                +
            </div>
            {usersList &&
                <div className={classes.usersList}>
                    Chat with:
                    {users}
                </div>
            }
        </div>

    );
};
export default CreateNewDialog;