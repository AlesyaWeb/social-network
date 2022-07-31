
let LOGIN = "LOGIN";
let IS_TOGGLE_FETCHING = 'IS_TOGGLE_FETCHING';
let UPDATE_EMAIL_TEXT = "UPDATE_EMAIL_TEXT";
let UPDATE_PASSWORD_TEXT = "UPDATE_PASSWORD_TEXT";
let SET_AUTH = "SET_AUTH"
let initialState = {
    emailText: "",
    passwordText: "",
    isAuth: false,
}
let loginReducer = (state = initialState, action) =>{
    switch (action.type){
        case IS_TOGGLE_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case UPDATE_EMAIL_TEXT:
            return{
                ...state,
                emailText: action.emailText
            }
        case UPDATE_PASSWORD_TEXT:
            return{
                ...state,
                passwordText: action.passwordText
            }    
        case LOGIN:
            return{
                emailText: null,
                passwordText: null,    
            }   
        case SET_AUTH:
            return{
                ...state,
                isAuth: action.isAuth
            }       
        default: return state;
    }

}
export const toggleIsFetching = (isFetching) => ({type: IS_TOGGLE_FETCHING, isFetching})
export const updateEmailText = (emailText) => ({type: UPDATE_EMAIL_TEXT, emailText})
export const setAuth = (isAuth) => ({type: SET_AUTH, isAuth})
export const updatePasswordText = (passwordText) => ({type: UPDATE_PASSWORD_TEXT, passwordText})
export default loginReducer;