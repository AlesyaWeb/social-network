import React, {useEffect} from 'react';
import socket from "../../context/socket";
import {connect} from "react-redux";
import {setOnlineUsers} from "../../redux/UsersReducer";

export const withUsersSockets = (Component) => {
    const smtp = (state) => {
        return {
            currentUser: state.auth.userInfo.id,
            onlineUsers: state.usersPage.onlineUsers
        }
    }

    class UsersSocketsContainer extends React.Component{
        render() {
            return <UsersSockets {...this.props} />
        }
    }
    const UsersSockets = (props) => {
        console.log('COMPONENT RENDER')
        useEffect(()=>{
            if(props.currentUser){
                socket.emit('identity', props.currentUser)
            }
        }, [])
        useEffect(()=>{
            socket.emit("getOnlineUsers")
        }, [])
        useEffect(()=>{
            socket.on("usersChanged", (users)=>{
                socket.emit('checkMe', props.currentUser)
                props.setOnlineUsers(users)
            })
        }, [socket])
        useEffect(() => {
            socket.emit('checkMe', props.currentUser)
        }, [])
        useEffect(() => {
            socket.on('checkedData', (isConnected) => {
                if(!isConnected) socket.emit('identity', props.currentUser)
            })
        }, [])
        return <Component {...props} />
    }
    return connect(smtp, {setOnlineUsers})(UsersSocketsContainer)
}