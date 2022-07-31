import React from "react";
import {
    addPost,
    changeTextPostCreateAction, dislikePost, likePost,
    OnBlureCreateAction,
    OnFocusCreateAction
} from "../../../../redux/ProfileReducer.js";
import MyPosts from "./MyPosts";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return{
        TextareaRows: state.ProfilePage.TextareaRows,
        PostsData: state.ProfilePage.PostsData,
        NewPostTextVal: state.ProfilePage.NewPostTextVal,
        ProfileId: state.ProfilePage.ProfileData.user,
        reactionInProgress: state.ProfilePage.reactionInProgress,
        userId: state.auth.userInfo.id
    }

}
const mapDispatchToProps = (dispatch, state) =>{
    return{
        dispatch: dispatch,
        likePost: (postId, userId) => dispatch(likePost(postId, userId)),
        dislikePost: (postId, userId) => dispatch(dislikePost(postId, userId)),
        addNewPost: (newPostText, files) => {
            dispatch(addPost(newPostText, files));
        },
        onPostChange: (text) => {
            dispatch(changeTextPostCreateAction(text));
        },
        doBigger: (textarea) => {
            dispatch(OnBlureCreateAction());
        },
        doLittle: (textarea) => {
            dispatch(OnFocusCreateAction());
        }
    }
}
const MyPostsContainer = connect(mapStateToProps, mapDispatchToProps)(MyPosts);
export default MyPostsContainer