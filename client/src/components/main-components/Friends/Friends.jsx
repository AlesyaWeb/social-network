import React, {useEffect} from 'react';
import {setFriends} from "../../../redux/FriendsReducer";
import Friend from "./Friend/Friend";
import User from "../Users/User/User";
import classes from "../Users/Users.module.css";
import {onlyOnlineFriends} from "../../../utils/onlyOnlineFriends";

const Friends = (props) => {
    return (
        <div>
            <div className={classes.onlineFriends}>
                <h1>Online friends</h1>
                {onlyOnlineFriends(props.friends, props.onlineUsers).map(friend => <Friend
                    className={classes.friend__item}
                    online={true}
                    id={friend.user}
                    first_name={friend.first_name}
                    last_name={friend.last_name}
                    avatar={friend.photo_50} />)}
            </div>
            <hr/>
            <div className={classes.allFriends}>
                <h1>Other</h1>
                {props.friends.map(friend => <Friend  className={classes.friend__item}
                                                      online={props.onlineUsers.includes(friend.user)}
                                                      id={friend.user}
                                                      first_name={friend.first_name}
                                                      last_name={friend.last_name}
                                                      avatar={friend.photo_50} />)}
            </div>
        </div>
    );
};

export default Friends;