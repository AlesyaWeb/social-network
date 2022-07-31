import React from 'react';
import classes from './FormControls.module.css'
import TextField from '@mui/material/TextField';
import {Box, InputLabel, MenuItem, Select} from "@mui/material";
import {FormControl as FormControlMui} from "@mui/material"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Dropzone from "react-dropzone";
import {has} from "mobx";
const FormControl = ({input, meta, child , ...props}) => {
    const hasError = meta.touched && meta.error
    console.log(hasError)
    return (
        <div style={{position: "relative"}} className={classes.form_control + " " + (hasError ? classes.error : "")}>
            <div>
                {props.children}
            </div>
            { meta.touched && meta.error && <span style={{position: "absolute", left: "0", fontSize: "12px"}}>{meta.error}</span> }
        </div>
    );
};

export const Input = (props) => {
    const {input, meta, child , ...restProps} = props;
    console.log(props)
    const hasError = props.meta.touched && props.meta.error
    return (
        <FormControl {...props}>
            <TextField id="outlined-basic" error={hasError} label={props.placeholder} variant="outlined" {...input} {...restProps} />
        </FormControl>
    );
};

// export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => {
//     const hasError = touched && error
//     return(
//         <TextField
//             id="outlined-basic" error={hasError} label={label} variant="outlined" {...input}
//             helperText={touched && error}
//             {...input}
//             {...custom}
//         />
//     )                                    it can be better practice than now
// }


export const DatePickerForm = (props) => {
    const {input, meta, child , ...restProps} = props;
    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));
    const handleChange = (newValue) => {
        setValue(newValue);
    };
    let hasError = props.meta.touched && props.meta.error
    return(
        <FormControl {...props}>
            <LocalizationProvider  dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    label="Дата рождения"
                    inputFormat="MM/dd/yyyy"
                    value={props.input.value}
                    onChange={handleChange}
                    {...input} {...restProps}
                    renderInput={(params) => <TextField error={hasError} {...input} {...restProps} {...params}/>}
                />
            </LocalizationProvider>
        </FormControl>
    )
}
export const TextareaCustom = (props) => {
    const {input, meta, child, ...restProps} = props;
    let hasError = props.meta.touched && props.meta.error
    console.log(props)
    return(
        <FormControl {...props}>
            <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                inputProps={{
                    maxlength: props.maxcharacters
                }}
                helperText={`${input.value.length}/${props.maxcharacters}`}
                label={props.placeholder}
                error={hasError}
                {...input} {...restProps}
            />
        </FormControl>
    )
}
export const SelectFormGender = (props) => {
    const {input, meta, child, ...restProps} = props;
    console.log(props)
    const hasError = props.meta.touched && props.meta.error
    return(
        <FormControl {...props}>
            <FormControlMui sx={{ m: 1}} style={{width: "100%"}}>
                <InputLabel id="demo-simple-select-helper-label">{props.placeholder}</InputLabel>
                <Select
                    {...input} {...restProps}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label={props.placeholder}
                    error={hasError}
                >
                    <MenuItem value={"male"}>мужской</MenuItem>
                    <MenuItem value={"female"}>женский</MenuItem>
                </Select>
            </FormControlMui>
        </FormControl>
    )
}




