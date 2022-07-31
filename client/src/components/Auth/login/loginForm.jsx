import React, {useRef, useState} from 'react';
import {Field, reduxForm} from "redux-form";
import {maxLengthCreator, required, validateEmail} from "../../../utils/validators";
import {Input} from "../../common/FormControls/FormControls";
import classes from './loginForm.module.css'
import ReCAPTCHA from "react-google-recaptcha";
import formControlClasses from "./../../common/FormControls/FormControls.module.css";
import {NEXT_PUBLIC_RECAPTCHA_KEY} from "../../api";
const maxLength10 = maxLengthCreator(10);
let LoginForm = (props) => {
    const [captchaVal, setCaptchaVal] = useState(null)

    const captchaOnChange = (val) => {
        setCaptchaVal(val)
    }

    const hasError = props.error

    return (
            <form onSubmit={props.handleSubmit(formData => {
                props.login(formData.email.replace(/\s/g,''), formData.password, captchaVal)
            })}>
                <div>
                    <div>
                        <div style={{height: "30px"}}></div>
                        <Field style={{width: "100%"}} type="text" name={"email"} validate={[required, validateEmail]} placeholder="email" component={Input} />
                        <div style={{height: "20px"}}></div>
                        <Field style={{width: "100%"}} type="password" name={"password"} validate={[required]} placeholder="password" component={Input}  />
                    </div>
                    <div style={{height: "20px"}}></div>
                    <div className={formControlClasses.error_field + " " + (hasError ? formControlClasses.error_true : "") }>
                        {props.error}
                    </div>
                    <div style={{height: "10px"}}></div>
                    <ReCAPTCHA sitekey={NEXT_PUBLIC_RECAPTCHA_KEY}
                               onChange={captchaOnChange}
                    />
                    <div style={{height: "10px"}}></div>
                    <button className={classes.loginButton}>login</button>
                </div>
            </form>
    );
};

LoginForm = reduxForm({
    form: "loginForm"
})(LoginForm)

export default LoginForm;