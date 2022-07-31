import React, {useEffect, useState} from "react";
import classes from './Users.module.css';
import User from "./User/User";
const Users = (props) =>{
    const [usersFilter, setUsersFilter] = useState("")

    return(
        // <Search details={props.users} />
        <>
            <input type="text"
                   placeholder={"search users"}
                   value={usersFilter}
                   className={classes.searchFilterInput}
                   onChange={(e)=>setUsersFilter(e.target.value)}
            />
            <div className={classes.usersContainer}>
                {
                    props.users.filter(user => {
                        const userName = `${user.first_name} ${user.last_name}`
                        if(usersFilter){
                            if(userName.toLowerCase().includes(usersFilter.toLowerCase())) return user
                        }
                        else{
                            return user
                        }
                    }).map( el =>  <User className={classes.friend__item}
                                         online={props.onlineUsers.includes(el.user)}
                                         id={el.user}
                                         addFriend={props.addFriend}
                                         cancelFriendQuery={props.cancelFriendQuery}
                                         acceptFriendQuery={props.acceptFriendQuery}
                                         rejectFriendQuery={props.rejectFriendQuery}
                                         deleteFriend={props.deleteFriend}
                                         currentUser={props.currentUser}
                                         isIncomingRequest={props.waitingFlAccept.includes(el.user)}
                                         isOutComigRequers={props.sentFlQueries.includes(el.user)}
                                         friends={props.friends}
                                         isFriend={props.friends.some(user => console.log(user.user))}
                                         first_name={el.first_name}
                                         last_name={el.last_name}
                                         avatar={el.photo_50} /> )
                }
            </div>
        </>
    );
}

export default Users;