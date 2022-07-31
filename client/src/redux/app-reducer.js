import {setUserData} from "./authReducer";
import {setUserProfile} from "./ProfileReducer";
import {setDialogsData, setMessagesData, subscribeOnChats} from "./MessagesReducer";
const INITIALIZED_SUCCESS = "INITIALIZED_SUCCESS"

let initialState = {
    initialized: false
}
const appReducer = (state = initialState, action) =>{
    switch (action.type){
        case INITIALIZED_SUCCESS:
            return {
                ...state,
                initialized: true
            }
        default: return state;
    }

}

export const initializeSuccess = () => ({type: INITIALIZED_SUCCESS})

export const initializeApp = () => (dispatch, getState) => {
    let promise = dispatch(setUserData())
    // let subscribe = dispatch(setDialogsData())
    Promise.all([promise]).then(()=>{
        dispatch(initializeSuccess());
    })

}


export default appReducer;