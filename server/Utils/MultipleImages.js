const uuid = require("uuid");
const {v2: cloudinary} = require("cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const UserInfo = require("../Models/userInfo");
const convertMultipleImagesToArray = async (images) => {
    let thumbs = []
    for(let i = 0; i<images.length; i++){
        await cloudinary.uploader.upload(images[i].tempFilePath, async (err, result) => {
            console.log(err)
            console.log(result)
            thumbs.push(result.url)
        })
    }
    console.log(thumbs)
    return thumbs
}
module.exports = convertMultipleImagesToArray