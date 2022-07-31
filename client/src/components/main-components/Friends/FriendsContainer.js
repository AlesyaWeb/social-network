import React from 'react';
import {compose} from "redux";
import {connect} from "react-redux";
import {withUsersSockets} from "../../hoc/WithUsersSockets";
import withAuthRedirect from "../../hoc/WithAuthRedirect";
import Friends from "./Friends";
import {setFriends} from "../../../redux/FriendsReducer";
import {withFriendsList} from "../../hoc/WithFriendsList";

class FriendsContainer extends React.PureComponent {
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if(prevProps !== this.props){
    //         console.log('--PP--')
    //         console.log(prevProps)
    //         console.log('--PP end--')
    //         console.log('--TP--')
    //         console.log(this.props)
    //         console.log('--TP end--')
    //     }
    // }
    render() {
        return (
            <Friends {...this.props} />
        );
    }
}

const mapStateToProps = (state) => ({
    friends: state.friendsPage.friends,
    waitingFlAccept: state.friendsPage.waitingFlAccept,
    sentFlQueries: state.friendsPage.sentFlQueries,
    onlineUsers: state.usersPage.onlineUsers
})

export default compose(
    connect(mapStateToProps, {setFriends}),
    withFriendsList,
    withUsersSockets,
    withAuthRedirect
)(FriendsContainer);