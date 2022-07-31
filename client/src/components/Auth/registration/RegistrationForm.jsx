import React from 'react';
import {Field, reduxForm} from "redux-form";
import {isDateValid, maxLengthCreator, required, validateEmail} from "../../../utils/validators";
import {
    DatePickerForm,
    Input,
    renderTextField,
    SelectFormGender,
    UploadFile
} from "../../common/FormControls/FormControls";
import classes from '../login/loginForm.module.css'
import formControlClasses from "./../../common/FormControls/FormControls.module.css";
const maxLength10 = maxLengthCreator(10);
let RegistrationForm = (props) => {
    console.log(props)
    const hasError = props.error
    return (
            <form onSubmit={props.handleSubmit}>
                <div>
                    <div>
                        <div style={{height: "30px"}}></div>
                        <Field style={{width: "100%"}} type="text" name={"first_name"} validate={[required]} label={"Имя"} placeholder="Имя" component={Input} />
                        <div style={{height: "20px"}}></div>
                        <Field style={{width: "100%"}} type="text" name={"last_name"} validate={[required]} placeholder="Фамилия" component={Input}  />
                        <div style={{height: "20px"}}></div>
                        <div className={classes.regDataAndGenderChoose} style={{display: "flex", alignItems: "center"}}>
                            <div style={{flex: "1 0 50%"}}>
                                <Field name={"bth_date"} validate={[required]} component={DatePickerForm} />
                            </div>
                            <div style={{flex: "0 1 50%"}}>
                                <Field name={"gender"} placeholder={"Пол"} validate={[required]} component={SelectFormGender} />
                            </div>

                        </div>
                        <div style={{height: "20px"}}></div>
                    </div>
                    <div>
                        <div style={{height: "30px"}}></div>
                        <Field style={{width: "100%"}} type="text" name={"email"} validate={[required, validateEmail]} placeholder="email" component={Input} />
                        <div style={{height: "20px"}}></div>
                        <Field style={{width: "100%"}} type="password" name={"password"} validate={[required]} placeholder="password" component={Input}  />
                    </div>
                    {/*<div>*/}
                    {/*    <h2>Avatar</h2>*/}
                    {/*    <Field type="file" name="files" component={UploadFile} />*/}
                    {/*</div>*/}
                    <div style={{height: "20px"}}></div>
                    <div className={formControlClasses.error_field + " " + (hasError ? formControlClasses.error_true : "") }>
                        {props.error}
                    </div>
                    <div style={{height: "10px"}}></div>
                    <button className={classes.loginButton}>registration</button>
                </div>
            </form>
    );
};

RegistrationForm = reduxForm({
    form: "registrationForm"
})(RegistrationForm)

export default RegistrationForm;