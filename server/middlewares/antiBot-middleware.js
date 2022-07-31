const ApiError = require('../exceptions/api-errors');
const axios = require("axios");
const secret = process.env.RECAPTCHA_SECRET_KEY
module.exports = async function (req, res, next) {
    try{
        let result = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.captcha}`,
            undefined,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                }
            }
        );
        let data = result.data || {};
        if(!data.success) return next(ApiError.IncorrectCaptcha())
        next();
    }
    catch(e){
        console.log(e)
    }
}