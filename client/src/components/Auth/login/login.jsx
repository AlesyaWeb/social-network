import React from 'react';
import classes from './login.module.css';
import LoginForm from "./loginForm";
import Redirect from "react-router-dom/es/Redirect";
import NavLink from "react-router-dom/es/NavLink";
const Login = (props) => {
    if(props.data.isAuth) {
        return <Redirect to={"/profile"} />
    }
    return(
        <div className={classes.authWrapper}>
                <h1>Login</h1>
                <LoginForm login={props.login} />
                <NavLink to={"registration"}>Не зарегестрирован?</NavLink>
        </div>
    );
}
export default Login;

