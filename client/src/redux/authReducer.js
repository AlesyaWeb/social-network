import {profileApi, userApi} from "../components/api";
import {stopSubmit} from "redux-form";
import socket from "../context/socket";


let SET_USER_DATA = 'SET_USER_DATA';
let SET_AUTH = 'SET_AUTH'
const UPLOAD_AVATAR = "UPLOAD_AVATAR"
let LOGIN = 'LOGIN'
const TOGGLE_IS_FETCHING = 'auth/TOGGLE_IS_FETCHING';
let SET_USER_INFO = 'SET_USER_INFO'
let initialState = {
    userInfo: [],
    isAuth: false,
    isFetching: false
}
let AuthReducer = (state = initialState, action) =>{
    switch (action.type){
        case SET_USER_DATA:
            return {
                ...state,
                ...action.data
            }
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            }
        case SET_AUTH:
            return {
                ...state,
                isAuth: action.isAuth
            }
        case UPLOAD_AVATAR: {
            return {
                ...state,
                userInfo: {...state.userInfo, photo_50: action.avatar}
            }
        }
        case TOGGLE_IS_FETCHING: {
            return { ...state, isFetching: action.isFetching}
        }
        default: return state;
    }

}
export const acceptUserData = (id, email, isActivated) => ({type: SET_USER_DATA, data: {id, email, isActivated}})
export const acceptUserInfo = (userInfo, isAuth) => ({type: SET_USER_INFO, userInfo})
export const uploadAvatarSuccess = (avatar) => ({type: UPLOAD_AVATAR, avatar})
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching})
export const setAuth = (isAuth) => ({type: SET_AUTH, isAuth})


export const login = (email, password, captcha) => (dispatch)=> {
        userApi.Login(email, password, captcha)
            .then(response => {
                if(response.status === 200){
                    localStorage.setItem('token', response.data.accessToken);
                    dispatch(setUserData());
                }
                else {
                    console.log(response)
                    let message = response.message.length > 0 ? response.message : "Unexpected error"
                    console.log(message)
                    dispatch(stopSubmit("loginForm", {_error: message}))
                }
            })
}

export const regUser = (email, password, userData) => (dispatch) => {
    debugger
    userApi.registration(email, password, userData)
        .then(response => {
            if(response.status === 200){
                localStorage.setItem('token', response.data.accessToken);
                dispatch(setUserData());
            }
            else {
                console.log(response)
                let message = response.message.length > 0 ? response.message : "Unexpected error"
                console.log(message)
                dispatch(stopSubmit("registrationForm", {_error: message}))
            }
        })
}

export const logout = (email, password) => {
    return (dispatch) => {
        userApi.Logout(email, password)
            .then(data => {
                if(data.resultCode === 0){
                    dispatch(setAuth(false));
                    dispatch(acceptUserData(null, null, null))
                    dispatch(acceptUserInfo([]))
                    socket.emit('logout');
                }
            })
    }
}

export const setUserData = () => (dispatch) => {
    return userApi.fetchUser().then(response => {
        if(response.status === 200){
            dispatch(setAuth(true))
            dispatch(acceptUserInfo(response.data.user))
            // const socket = io('http://localhost:3008')
            // console.log(socket)
            console.log(response.data.user.id)
            socket.emit("identity", response.data.user.id)
        }
        else {
            dispatch(setAuth(false))
        }
    }).catch(()=>{
        dispatch(setAuth(false))
    })

}
export const uploadAvatar = (avatar) => (dispatch) => {
    dispatch(toggleIsFetching(true))
    profileApi.uploadAvatar(avatar).then(response => {
        if(response.status === 200){
            dispatch(uploadAvatarSuccess(response.data.avatar));
            dispatch(toggleIsFetching(false))
        }
    })

}
export const checkAuth = () => (dispatch) => {
    try{
        debugger
        userApi.checkAuth().then(response => {
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            dispatch(setAuth(true))

        })
    }
    catch (e){
        console.log(e.response?.data?.message)
    }
}

export default AuthReducer;