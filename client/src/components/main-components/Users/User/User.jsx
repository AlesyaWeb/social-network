import classes from './User.module.css';
import {NavLink} from "react-router-dom";
import {acceptFriendQuery, addFriend, cancelFriendQuery, rejectFriendQuery} from "../../../../redux/FriendsReducer";

const User = (props) =>{
    const isFriend = props.friends.some(user => user.user === props.id)
    const isARequest = props.isIncomingRequest || props.isOutComigRequers
    console.log(isARequest)
    const isCurrentUser = props.currentUser === props.id
    return(
        <div>
            {!isCurrentUser &&
                <div className={classes.Friend}>
                    <NavLink to={'/profile/' + props.id} className={classes.friend__avatar}>
                        <img width="60" src={props.avatar} alt=""/>
                    </NavLink>
                    <div className={classes.friend__name}>
                        {props.first_name}
                        <span>    </span>
                        {props.last_name}
                    </div>
                    <div className={classes.isOnline}>{props.online ? <div className={classes.online}>Online</div> :
                        <div className={classes.ofline}>offline</div>}</div>
                    <div className={classes.addToFriendsButtonInner}>
                        {isARequest ?
                        props.isOutComigRequers ? <button onClick={()=>props.cancelFriendQuery(props.id)}>cancel request</button>
                            : <div>
                                <button onClick={()=>props.acceptFriendQuery(props.id)}>Accept</button>
                                <button style={{background: "red"}} onClick={()=>props.rejectFriendQuery(props.id)}>Reject</button>
                            </div> :
                            isFriend ?
                                <button style={{background: "red"}}
                                        className={classes.deleteFromFriend}
                                        onClick={()=>props.deleteFriend(props.id)}>Delete from friends</button> :
                                <button className={classes.addToFriends} onClick={()=>props.addFriend(props.id)}>Add to friends</button>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default User;