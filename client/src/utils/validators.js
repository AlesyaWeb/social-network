// is field required
export const required = (value) => {
    if(!value) return "Field is required"
    return undefined
}

//is email valid
export const validateEmail = (email) => {
    let emailToVaildate = String(email)
        .toLowerCase()
        .replace(/\s/g,'')
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    if(!emailToVaildate) return `Wrong email address`
    return undefined
};

// maximum value length
export const maxLengthCreator = (maxLength) => (value) => {
    if(value.length > maxLength) return `Max length is ${maxLength} symbols`
    return undefined
}