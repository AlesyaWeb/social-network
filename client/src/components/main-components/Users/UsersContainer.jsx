
import React from 'react';
import {setOnlineUsers, setUsers, toggleIsFetching} from "../../../redux/UsersReducer";
import {connect} from "react-redux";
import Users from "./Users";
import Preloader from "../../common/Preloader";
import WithAuthRedirect from "../../hoc/WithAuthRedirect";
import {compose} from "redux";
import socket from "../../../context/socket";
import {withUsersSockets} from "../../hoc/WithUsersSockets";
import {withFriendsList} from "../../hoc/WithFriendsList";
import {
    acceptFriendQuery,
    addFriend,
    cancelFriendQuery,
    deleteFriend,
    rejectFriendQuery
} from "../../../redux/FriendsReducer";
class FriendsC extends React.Component {
    componentDidMount() {
        this.Test();
    }
    Test = () => {
        this.props.setUsers()
    }
    render() {
        return <>
            {
                this.props.isFetching ? <Preloader isFetching={this.props.isFetching} /> :
                    <Users {...this.props}

                    />
            }
        </>
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.usersPage.users,
        isFetching: state.usersPage.isFetching,
        onlineUsers: state.usersPage.onlineUsers,
        waitingFlAccept: state.friendsPage.waitingFlAccept,
        sentFlQueries: state.friendsPage.sentFlQueries,
        currentUser: state.auth.userInfo.id,
        friends: state.friendsPage.friends
    }
}



export default compose(
    connect(mapStateToProps, {
        setUsers,
        toggleIsFetching,
        setOnlineUsers,
        cancelFriendQuery,
        acceptFriendQuery,
        rejectFriendQuery,
        deleteFriend,
        addFriend
    }),
    withFriendsList,
    withUsersSockets
)(FriendsC)