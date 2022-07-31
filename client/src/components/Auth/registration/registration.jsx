import React from 'react';
import classes from './registration.module.css';
import RegistrationForm from "./RegistrationForm";
import {NavLink} from "react-router-dom";
const Registration = (props) => {
    const registration = (values) => {
        let userData = {
            "first_name": values.first_name,
            "last_name": values.last_name,
            "age": values.bth_date,
            "gender": values.gender
        }
        console.log(props)
        props.regUser(values.email, values.password, userData)
    }
    return (
        <div className={classes.registrationWrapper}>
            <h1>Registration</h1>
            <RegistrationForm onSubmit={registration} />
            <NavLink to={"/login"}>Уже зарегестрированы?</NavLink>
        </div>
    );
};

export default Registration;