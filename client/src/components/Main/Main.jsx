import Side from "./../main-components/Side/Side";
import classes from './Main.module.css';
import {BrowserRouter, Route, withRouter} from "react-router-dom";
import ProfileContainers from "../main-components/Profile/ProfileContainer";
import DialogsContainer from "../main-components/Dialogs/DialogsContainer";
import UsersContainer from "../main-components/Users/UsersContainer";
import FriendsContainer from "../main-components/Friends/FriendsContainer";
import LoginContainer from "../Auth/login/loginContainer";
import {compose} from "redux";
import RegistrationContainer from "../Auth/registration/registrationContainer";
import ProfileSettingsContainer from "../main-components/ProfileSettings/ProfileSettingsContainer";
import {useEffect} from "react";
import socket from "../../context/socket";
const Main = (props) => {
    console.log(process.env.PUBLIC_URL)
    return (
            <main className={classes.main}>
                <div className={classes.container}>
                    <div className={classes.main__wrapper}>
                        <Side/>
                        <div className={classes.content}>
                            <Route path="/" element={<div>Hello</div>} />
                            <Route path="/profile/:userId?" render={ () => <ProfileContainers /> } />
                            <Route path="/dialogs" render={ () => <DialogsContainer /> } />
                            <Route path="/users" render={ () => <UsersContainer /> } />
                            <Route path="/Login" render={ () => <LoginContainer /> } />
                            <Route path="/registration" render={()=> <RegistrationContainer />}/>
                            <Route path="/settings" render={ () => <ProfileSettingsContainer /> } />
                            <Route path="/friends" render={ () => <FriendsContainer /> } />
                            <Route path="*" element={<div>Not found</div>} />
                        </div>
                    </div>
                </div>
            </main>
    );
}

export default withRouter(Main);