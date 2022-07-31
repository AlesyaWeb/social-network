import React, {useEffect} from "react";
import {connect} from "react-redux";
import {setFriends} from "../../redux/FriendsReducer";

export const withFriendsList = (Component) => {
    const smtp = (state) => {
        return {
            friends: state.friendsPage.friends
        }
    }

    class FriendsListContainer extends React.Component{
        render() {
            return <FriendsList {...this.props} />
        }
    }
    const FriendsList = (props) => {
        useEffect(()=>{
            props.setFriends()
        }, [])
        return <Component {...props} />
    }
    return connect(smtp, {setFriends})(FriendsListContainer)
}