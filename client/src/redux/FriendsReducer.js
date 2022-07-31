import {friendsApi} from "../components/api";


let SET_FRIENDS = 'SET_FRIENDS';
let ADD_TO_FRIENDS_QUERY  = 'ADD_TO_FRIENDS';
let ACCEPT_FRIENDS_QUERY  = 'ACCEPT_FRIENDS_QUERY';
let REJECT_FRIENDS_QUERY  = 'REJECT_FRIENDS_QUERY';
let DELETE_FRIEND = 'DELETE_FRIEND';
let CANCEL_FRIEND_QUERY = 'CANCEL_FRIEND_QUERY';
let initialState = {
    friends: [],
    sentFlQueries: [],
    waitingFlAccept: []
}

let friendsReducer = (state = initialState, action) => {
    switch (action.type){
        case SET_FRIENDS: {
            return {
                ...state,
                friends: action.friends,
                sentFlQueries: action.sentFlQueries,
                waitingFlAccept: action.waitingFlAccept
            }
        }
        case ADD_TO_FRIENDS_QUERY:{
            return {
                ...state,
                sentFlQueries: [...state.sentFlQueries, action.to]
            }
        }
        case CANCEL_FRIEND_QUERY: {
            return {
                ...state,
                sentFlQueries: state.sentFlQueries.filter(query => query !== action.friendId)
            }
        }
        case ACCEPT_FRIENDS_QUERY: {
            return {
                ...state,
                friends: [...state.friends, action.sender],
                waitingFlAccept: state.waitingFlAccept.filter(user => user !== action.sender.user)
            }
        }
        case REJECT_FRIENDS_QUERY: {
            debugger
            return {
                ...state,
                waitingFlAccept: state.waitingFlAccept.filter(user => user !== action.friendId)
            }
        }
        case DELETE_FRIEND: {
            return {
                ...state,
                friends: state.friends.filter(user => user.user !== action.friendId)
            }
        }
        default: return state
    }
}

const setFriendsSuccess = (friends, waitingFlAccept, sentFlQueries) => ({type: SET_FRIENDS, friends, waitingFlAccept, sentFlQueries})
const addToFriendsQuerySuccess = (to) => ({type: ADD_TO_FRIENDS_QUERY, to})
const cancelFriendQuerySuccess = (friendId) => ({type: CANCEL_FRIEND_QUERY, friendId})
const acceptFriendQuerySuccess = (sender) => ({type: ACCEPT_FRIENDS_QUERY, sender})
const rejectFriendQuerySuccess = (friendId) => ({type: REJECT_FRIENDS_QUERY, friendId})
const deleteFriendSuccess = (friendId) => ({type: DELETE_FRIEND, friendId})
export const setFriends = () => async (dispatch) => {
    try {
        const response = await friendsApi.getFriends()
        const data = response.data
        dispatch(setFriendsSuccess(data.friends, data.waitingFlAccept, data.sentFlQueries))
    }
    catch (e){
        console.log(e)
    }
}
export const addFriend = (to) => async (dispatch) => {
    try {
        const response = await friendsApi.addToFriendsQuery(to)
        dispatch(addToFriendsQuerySuccess(to))
    }
    catch (e) {
        console.log(e)
    }
}
export const cancelFriendQuery = (friendId) => async (dispatch) => {
    try {
        const response = await friendsApi.cancelFriendQuery(friendId)
        dispatch(cancelFriendQuerySuccess(friendId))
    }
    catch (e) {
        console.log(e)
    }
}
export const acceptFriendQuery = (friendId) => async (dispatch) => {
    try {
        const response = await friendsApi.acceptFriendQuery(friendId)
        console.log(response.data.sender)
        dispatch(acceptFriendQuerySuccess(response.data.sender))
    }
    catch (e) {
        console.log(e)
    }
}
export const rejectFriendQuery = (friendId) => async (dispatch) => {
    try {
        const response = await friendsApi.rejectFriendQuery(friendId)
        dispatch(rejectFriendQuerySuccess(friendId))
    }
    catch (e) {
        console.log(e)
    }
}
export const deleteFriend = (friendId) => async (dispatch) => {
    try {
        const response = await friendsApi.deleteFriend(friendId)
        dispatch(deleteFriendSuccess(friendId))
    }
    catch (e) {
        console.log(e)
    }
}
export default friendsReducer;