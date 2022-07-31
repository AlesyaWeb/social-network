import {dialogsApi} from "../components/api";
const ADD_MESSAGE = 'ADD-MESSAGE';
const CHANGE_MESSAGE_TEXT = 'CHANGE-MESSAGE-TEXT';
const SET_DIALOGS_DATA = 'messages/SET_DIALOGS_DATA';
const TOGGLE_IS_FETCHING_MESS = 'messages/TOGGLE_IS_FETCHING';
const SET_CURRENT_DIALOG = 'messages/SET_CURRENT_DIALOG';
const TOGGLE_IS_FETCHING_CONVERSATION = 'TOGGLE_IS_FETCHING_CONVERSATION'
const SET_MESSAGES_DATA = 'messages/SET_MESSAGES_DATA';
const ADD_DIALOG = "ADD_DIALOG"
let initialState = {
    dialogsData: [],
    rooms: [],
    users: [],
    messagesData: [],
    newMessageText: '',
    isFetching: true,
    conversationIsFetching: true,
    currentDialog: null
};

const MessagesReducer = (state = initialState, action) => {
    switch (action.type){
        case ADD_MESSAGE: {

            if(state.newMessageText.length >= 1 || action.newMessageText.length >= 1){
                let newMessage = {
                    sentBy: action.sentBy,
                    createdAt: action.createdAt,
                    message: action.newMessageText
                }
                return {
                    ...state,
                    messagesData: [...state.messagesData, newMessage],
                    newMessageText: ''
                };
            }
        }
        case TOGGLE_IS_FETCHING_MESS: {
            return { ...state, isFetching: action.isFetching}
        }
        case CHANGE_MESSAGE_TEXT: {
            return {
                ...state,
                newMessageText: action.newMessText
            };
        }
        case SET_DIALOGS_DATA: {
            return {
                ...state,
                dialogsData: {...state.dialogsData, rooms: action.dialogsData.rooms, users: action.dialogsData.allUsers}
            }
        }
        case TOGGLE_IS_FETCHING_CONVERSATION: {
                return {
                    ...state,
                    conversationIsFetching: action.convIsFetching
                }
        }
        case SET_CURRENT_DIALOG:
        {
            return {
                ...state,
                currentDialog: action.currentDialog
            }
        }
        case SET_MESSAGES_DATA: {
            let messages = []
            action.data.map(message => messages.push({message: message.message, sentBy: message.postedByUser, createdAt: message.createdAt}))
            return {
                ...state,
                messagesData: messages
            }
        }
        case ADD_DIALOG: {
            return {
                ...state,
                dialogsData: {...state.dialogsData, rooms: [...state.dialogsData.rooms, action.room], users: [...state.dialogsData.users, action.user] }
            }
        }
        default: return state;
    }
}

export const addMessageActionCreator = (newMessageText, sentBy) => ({type: ADD_MESSAGE, newMessageText, sentBy})

export const changeMessageTextActionCreator = (text) => {
    return{type: CHANGE_MESSAGE_TEXT, newMessText: text}
}
export const setCurrentDialog = (currentDialog) => ({type: SET_CURRENT_DIALOG, currentDialog})
export const setMessagesDataSuccess = (data) => ({type: SET_MESSAGES_DATA, data})
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING_MESS, isFetching })
export const setDialogsDataSuccess = (data) => ({type: SET_DIALOGS_DATA, dialogsData: data})
export const addDialogSuccess = (room, users) => ({type: ADD_DIALOG, room: room, users: users})
export const toggleIsFetchingConversation = (convIsFetching) => ({type: TOGGLE_IS_FETCHING_CONVERSATION, convIsFetching })
export const setDialogsData = () => async (dispatch, getState) => {
    try{
        dispatch(toggleIsFetching(true))
        const response = await dialogsApi.getDialogsData()
        console.log(response.data)
        dispatch(setDialogsDataSuccess(response.data))
        dispatch(toggleIsFetching(false))
    }
    catch (e){
        console.log(e)
    }

}
export const setMessagesData = (room, type) => async (dispatch, getState) => {
    try {
        const setMessagesFunc = async () => {
            const response = await dialogsApi.getConversationById(room)
            console.log(response)
            dispatch(setMessagesDataSuccess(response.data.conversation))
        }
        if(type === "loadMessages"){
            dispatch(toggleIsFetchingConversation(true))
            await setMessagesFunc()
            dispatch(toggleIsFetchingConversation(false))
        }
        else if (type === "getMessage"){
            await setMessagesFunc()
        }
    }
    catch (e){
        console.log(e)
    }
}
export const sendMessage = (messageText, room, receiverId) =>  async(dispatch) => {
    try {
        if(messageText.length > 0){
            const response = await dialogsApi.sendMessage(messageText, room, receiverId)
            dispatch(addMessageActionCreator(response.data.message, response.data.postedByUser))
        }

    }
    catch (e){
        console.log(e)
    }
}
export const createNewDialog = (userId) => async (dispatch, getState) => {
        if(userId !== getState().auth.userInfo.id){
            return await dialogsApi.initiateDialog(userId).then(response => {
                dispatch(setDialogsData())
                return response
            })
        }
}
export default MessagesReducer;