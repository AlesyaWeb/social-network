import {profileApi, userApi} from "../components/api";
import {stopSubmit} from "redux-form";
import * as _ from 'lodash';
const CHANGE_TEXT_POST = 'CHANGE-TEXT-POST';
const ADD_POST = 'ADD-POST';
const ON_BLURE = 'ON-BLURE';
const ON_FOCUS = 'ON-FOCUS';
const SET_USER_PROFILE = 'SET_USER_PROFILE';
const SET_AUTH = "SET_AUTH";
const UPLOAD_AVATAR = "UPLOAD_AVATAR";
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_USER_STATUS = "SET_USER_STATUS";
const SET_POSTS = "SET_POSTS";
const LIKE_POST = "LIKE_POST";
const DISLIKE_POST = "DISLIKE_POST";
const TOGGLE_IS_REACTION_PROGRESS = 'TOGGLE_IS_REACTION_PROGRESS';
let initialState = {
    ProfileData: [],
    PostsData: [],
    status: "",
    NewPostTextVal: '',
    TextareaRows: 5,
    isFetching: true,
    reactionInProgress: []
}

const ProfileReducer = (state = initialState, action) => {
    switch (action.type){
        case ADD_POST: {

            let newPost = {
                postText: action.postText,
                postThumbnails: action.postThumbnails,
                likes: [],
                dislikes: []
            }
            return {
                ...state,
                PostsData: [newPost, ...state.PostsData]
            };
        }
        case SET_POSTS: {
            return {
                ...state,
                PostsData: action.posts.reverse()
            }
        }
        case CHANGE_TEXT_POST: {
            return {
                ...state,
                NewPostTextVal: action.newText
            };
        }
        case TOGGLE_IS_FETCHING: {
            return { ...state, isFetching: action.isFetching}
        }
        case ON_BLURE: {
            return {
                ...state,
                TextareaRows: 2
            };
        }
        case ON_FOCUS:
            return {
                ...state,
                TextareaRows: 5
            };
        case SET_USER_PROFILE:
            return {
                ...state,
                ProfileData: action.profile
            }
        case SET_USER_STATUS:{
            return {
                ...state,
                status: action.status
            }
        }
        case UPLOAD_AVATAR: {
            //HERE MB POOP CODE CAUSE THIS ACTION IS FROM AUTH REDUCER
            return {
                ...state,
                ProfileData: {...state.ProfileData, photo_50: action.avatar}
            }
        }
        case LIKE_POST: {
            let postsData = [...state.PostsData]
            const lPost = postsData.map(post => {
                if(post._id === action.postId){
                    post.likes = action.likes
                    post.dislikes = action.dislikes
                }
                return post
            })
            return {
                ...state,
                PostsData: lPost
            }
        }
        case DISLIKE_POST: {
            let postsData = [...state.PostsData]
            const lPost = postsData.map(post => {
                if(post._id === action.postId){
                    post.likes = action.likes
                    post.dislikes = action.dislikes
                }
                return post
            })
            return {
                ...state,
                PostsData: lPost
            }
        }
        case TOGGLE_IS_REACTION_PROGRESS:
            return {
                ...state,
                reactionInProgress: action.isProgressing ? [...state.reactionInProgress, action.postId] : [state.reactionInProgress.filter(id => id !== action.postId)]
            }
        default: return state;
    }
}

export const toggleIsFetching = (isFetching) => {
    return {type: TOGGLE_IS_FETCHING, isFetching}
}
const likePostSuccess = (likes, dislikes, postId) => {
    return {type: LIKE_POST, likes, dislikes, postId}
}
const dislikePostSuccess = (likes, dislikes, postId) => {
    return {type: DISLIKE_POST, likes, dislikes, postId}
}
export const addPostCreateAction = (postText, postThumbnails) => {
    return{type: ADD_POST, postText, postThumbnails};
}
export const toggleReactionInProgress = (isProgressing, postId) => ({type: TOGGLE_IS_REACTION_PROGRESS, isProgressing, postId})
export const setPostsSuccess = (posts) => ({type: SET_POSTS, posts})
export const changeTextPostCreateAction = (text) => {
    return{type: CHANGE_TEXT_POST, newText: text};
}
export const addPost = (postText, PostFiles) => async (dispatch, getState) => {
    const response = await profileApi.addPost(postText, PostFiles)
    console.log(response.data.addPost.postText)
    dispatch(
        addPostCreateAction(response.data.addPost.postText, response.data.addPost.postThumbnails)
    )
    dispatch(setPosts(getState().auth.userInfo.id))
}
export const setPosts = (id) => async (dispatch) => {
    const response = await profileApi.getPosts(id)
    dispatch(setPostsSuccess(response.data.posts))
}
export const OnBlureCreateAction = () => {
    return{type: ON_BLURE};
}
export const OnFocusCreateAction = () => {
    return{type: ON_FOCUS};
}
export const setAuth = (isAuth) => ({type: SET_AUTH, isAuth})
export const acceptUserProfile = (profile) => ({type: SET_USER_PROFILE, profile})

export const setUserStatus = (status) => ({type: SET_USER_STATUS, status})
export const getUserStatus = (userId) => (dispatch) => {
    profileApi.getUserStatus(userId).then(response => {
        console.log(response.data.status)
        dispatch(setUserStatus(response.data.status))
    })
}

export const updateUserStatus = (status) => (dispatch) => {
    profileApi.updateUserStatus(status).then(response => {
        if(response.data.resultCode === 0 ){
            dispatch(setUserStatus(status))
        }

    })
}
export const updateUserProfileData = (profileNewData) => async(dispatch, getState) => {
    const userId = getState().auth.userId
    let response = await profileApi.updateUserProfileInfo(profileNewData);
    if(response.status === 200){
        if(response.data.resultCode === 0){
            dispatch(setUserProfile(userId))
        }
        else{
            dispatch(stopSubmit("ProfileSettingsForm", {_error: response.data.messages[0]}))
        }
    }
}
export const setUserProfile = (userId) => {
    return (dispatch) => {
        dispatch(toggleIsFetching(true))
        userApi.setUserProfile(userId)
            .then(response => {
                console.log(response.data)
                dispatch(acceptUserProfile(response.data))
                dispatch(setPosts(userId))
                dispatch(toggleIsFetching(false))
            })
    }
}

export const likePost = (postId, userId) => async (dispatch) => {
    try{
        dispatch(toggleReactionInProgress(true, postId));
        const response = await profileApi.likePost(postId)
        dispatch(likePostSuccess(response.data.likes, response.data.dislikes, postId))
        dispatch(toggleReactionInProgress(false, postId));
    }
    catch (e){
        console.log(e)
    }
}


export const dislikePost = (postId, userId) => async (dispatch) => {
    try{
        dispatch(toggleReactionInProgress(true, postId));
        const response = await profileApi.dislikePost(postId)
        dispatch(dislikePostSuccess(response.data.likes, response.data.dislikes, postId))
        dispatch(toggleReactionInProgress(false, postId));
    }
    catch (e){
        console.log(e)
    }
}

export default ProfileReducer;
