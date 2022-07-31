import React from 'react';
import {Field, reduxForm} from "redux-form";
import {required, validateEmail} from "../../../utils/validators";
import {DatePickerForm, Input, TextareaCustom} from "../../common/FormControls/FormControls";
import formControlClasses from "../../common/FormControls/FormControls.module.css";
import classes from "./ProfileSettings.module.css";

let ProfileSettingsForm = (props) => {
    console.log('here is some props')
    console.log(props)
    const hasError = props.error
    return (
        <form onSubmit={props.handleSubmit}>
            <div>
                <div>
                    <div style={{height: "30px"}}></div>
                    <Field style={{width: "100%"}} type="text" maxcharacters={100} name={"description"} placeholder="about me" component={TextareaCustom} />
                    <div style={{height: "20px"}}></div>
                    {/*<Field style={{width: "296px", flex: "1 0 50%"}} name={"age"} component={DatePickerForm} />*/}
                </div>
                <div style={{height: "20px"}}></div>
                <div className={formControlClasses.error_field + " " + (hasError ? formControlClasses.error_true : "") }>
                    {props.error}
                </div>
                {props.submitSucceeded && <div className={classes.successMessage}>Changes successfully applied</div>}
                <div style={{height: "10px"}}></div>
                <button className={classes.applyChangesButton}>apply changes</button>
            </div>
        </form>
    );
};

ProfileSettingsForm = reduxForm({
    form: 'ProfileSettingsForm'
})(ProfileSettingsForm)

export default ProfileSettingsForm;