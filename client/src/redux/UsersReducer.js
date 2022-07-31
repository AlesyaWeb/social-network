import {userApi} from "../components/api";


let SET_USERS = 'SET_USERS';
let IS_TOGGLE_FETCHING = 'IS_TOGGLE_FETCHING';
let SET_ONLINE_USESR = 'SET_ONLINE_USESR'
let initialState = {
    users: [],
    onlineUsers: [],
    isFetching: false
}
let UsersReducer = (state = initialState, action) =>{
    switch (action.type){
        case SET_USERS:
            return {
                ...state,
                users: action.users
            }
        case IS_TOGGLE_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case SET_ONLINE_USESR:
            return {
                ...state,
                onlineUsers: action.onlineUsers
            }
        default: return state;
    }

}
export const acceptUsers = (users) => ({type: SET_USERS, users})
export const toggleIsFetching = (isFetching) => ({type: IS_TOGGLE_FETCHING, isFetching})
export const setOnlineUsers = (onlineUsers) => ({type: SET_ONLINE_USESR, onlineUsers})
export const setUsers = () => {
    return (dispatch) => {
        dispatch(toggleIsFetching(true));
        userApi.fetchUsers().then(data => {
            dispatch(toggleIsFetching(false));
            dispatch(acceptUsers(data));
        })
    }
}
export default UsersReducer;

