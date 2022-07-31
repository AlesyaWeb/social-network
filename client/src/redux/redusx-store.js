import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import ProfileReducer from "./ProfileReducer";
import MessagesReducer from "./MessagesReducer";
import UsersReducer from "./UsersReducer";
import AuthReducer from "./authReducer";
import loginReducer from "./loginReducer";
import friendsReducer from './FriendsReducer'
import thunkMiddleWare from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import appReducer from "./app-reducer";
let reducers = combineReducers({
   ProfilePage: ProfileReducer,
   messagesPage: MessagesReducer,
   usersPage: UsersReducer,
   auth: AuthReducer,
   login: loginReducer,
   friendsPage: friendsReducer,
   appe: appReducer,

   form: formReducer
})
const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
           // Specify extension’s options like name, actionsDenylist, actionsCreators, serialize...
        })
        : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunkMiddleWare)
    // other store enhancers if any
);
const store = createStore(reducers, enhancer);
// let store = createStore(reducers, applyMiddleware(thunkMiddleWare));
window.store = store;
export default store;