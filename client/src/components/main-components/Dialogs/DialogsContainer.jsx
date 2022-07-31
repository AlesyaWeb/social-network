
import React from "react";
import {
    addMessageActionCreator,
    changeMessageTextActionCreator, createNewDialog, sendMessage,
    setCurrentDialog,
    setDialogsData, setMessagesData
} from "../../../redux/MessagesReducer";
import {connect} from "react-redux";
import Dialogs from "./Dialogs";
import {compose} from "redux";
import WithAuthRedirect from "../../hoc/WithAuthRedirect";
import {setOnlineUsers, setUsers} from "../../../redux/UsersReducer";
import {withUsersSockets} from "../../hoc/WithUsersSockets";
import {withFriendsList} from "../../hoc/WithFriendsList";
class DialogsContainer extends React.Component {
    componentDidMount() {
        this.props.setDialogsData()
        this.props.setUsers()
    }

    render() {
        if(this.props.isFetching) return <div>загрузка</div>
        return <Dialogs {...this.props} />
    }
}

const mapStateToProps = (state) => {
    return{
        dialogsData: state.messagesPage.dialogsData,
        messagesData: state.messagesPage.messagesData,
        newMessageText: state.messagesPage.newMessageText,
        isFetching: state.messagesPage.isFetching,
        convIsFetching: state.messagesPage.conversationIsFetching,
        currentUser: state.auth.userInfo.id,
        friends: state.friendsPage.friends,
        setMessagesData: state.messagesPage.setMessagesData,
        currentRoom: state.messagesPage.currentDialog,
        usersList: state.friendsPage.friends,
        onlineUsersList: state.usersPage.onlineUsers,
    }
}



export default compose(
    connect(mapStateToProps, {
        addMessage: addMessageActionCreator,
        ChangeNewMessage: changeMessageTextActionCreator,
        setDialogsData,
        setMessagesData,
        setOnlineUsers,
        setCurrentDialog,
        sendMessage,
        setUsers,
        createNewDialog
    }),
    withUsersSockets,
    withFriendsList,
    WithAuthRedirect
)(DialogsContainer)