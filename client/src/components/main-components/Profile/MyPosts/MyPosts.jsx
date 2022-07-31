import React, {useState} from "react";
import classes from './MyPosts.module.css';
import Post from './Post/Post';
import addFiliIcon from '../../../../assets/images/addFile.png'
import AddPostForm from "./addPostForm/addPostForm";
import {likePost} from "../../../../redux/ProfileReducer";

const MyPosts = React.memo(props =>{
    console.log('--------------------RENDER--------------------')
    let noPosts = '';
    if (props.PostsData.length <= 0) {
        noPosts = 'There are no posts'
    }
    let postsElements = props.PostsData
        .map( p => <Post reactionInProgress={props.reactionInProgress}
                         likePost={props.likePost}
                         dislikePost={props.dislikePost}
                         userId={props.userId}
                         avatar={props.avatar}
                         thumbnails={p.postThumbnails}
                         message={p.postText}
                         likes={p.likes}
                         dislikes={p.dislikes}
                         id={p._id}
                         userName={props.userName} />);

    let isProfileEqsUser = props.ProfileId === props.userId
    return(
        <div className={classes.posts__wrapper}>
            {isProfileEqsUser && <AddPostForm
                doBigger={props.doBigger}
                doLittle={props.doLittle}
                addNewPost={props.addNewPost}
                TextareaRows={props.TextareaRows}
            />
            }
            <h1 className={classes.posts__title}>Posts</h1>
            <div className={classes.posts}>{postsElements} {noPosts}</div>
        </div>
    );
})

export default MyPosts;