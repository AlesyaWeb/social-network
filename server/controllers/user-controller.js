const {validationResult} = require('express-validator');
const userService = require('../service/user-service');
const ApiError = require('../exceptions/api-errors');
const ageCalc = require("../Utils/ageCalc");
class userController {
    async registration (req, res, next) {
        try {
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            const {email, password} = req.body;
            const reqUserInfo = {
                first_name: req.body.userData.first_name,
                last_name: req.body.userData.last_name,
                gender: req.body.userData.gender,
                age: ageCalc(req.body.userData.age),
                photo_50: req.body.userData.photo_50,
                // photo_50: 'http://localhost:3008/uploads/'+req.file.filename,
                description: req.body.userData.description
            }
            let requiredFields = ['first_name', 'last_name', 'age', 'gender']
            for(let key in reqUserInfo){
                for(let i in requiredFields){
                    if(key === requiredFields[i] && !reqUserInfo[key]){
                        throw ApiError.BadRequest(`Заполните все поля ( ${requiredFields[i]} )`)
                    }
                }
            }
            const userData = await userService.registration(email, password, reqUserInfo)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        }
        catch (e){
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        }
        catch (e){
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }
        catch (e){
            next(e);
        }
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        }
        catch (e){
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        }
        catch (e){
            next(e);
        }
    }
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        }
        catch (e){
            next(e);
        }
    }
    async getUserProfile(req, res, next){
        try{
            const user = await userService.getUserProfile(req.params.id);
            res.json(user)
        }
        catch (e){
            next(e)
        }
    }
    async getCurrentUser(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.getCurrentUser(refreshToken);
            res.json(userData);
        }
        catch (e){
            next(e)
        }
    }
    async updateStatus(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            let status = req.body.status;
            const userData = await userService.updateStatus(refreshToken, status);
            res.json(userData);
        }
        catch (e){
            next(e)
        }
    }
    async setUserAvatar(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const avatar = req.files.file
            const setAvatar = await userService.setUserAvatar(refreshToken, avatar);
            res.json(setAvatar);
        }
        catch (e){
            next(e)
        }
    }
    async editProfile(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const dataToEdit = req.body
            const editProfile = await userService.editProfile(refreshToken, dataToEdit);
            res.json(editProfile);
        }
        catch (e){
            next(e)
        }
    }
    async addToFriendsQuery(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const {to} = req.body
            const addQuery = await userService.addToFriendsQuery(refreshToken, to);
            res.json(addQuery);
        }
        catch (e){
            next(e)
        }
    }
    async acceptFriendQuery(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const {from} = req.body
            const accept = await userService.acceptFriendQuery(refreshToken, from);
            res.json(accept);
        }
        catch (e){
            next(e)
        }
    }
    async rejectFriendQuery(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const {from} = req.body
            const reject = await userService.rejectFriendQuery(refreshToken, from);
            res.json(reject);
        }
        catch (e){
            next(e)
        }
    }
    async deleteFriend(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const {friendId} = req.body
            const deleteFriend = await userService.deleteFriend(refreshToken, friendId);
            res.json(deleteFriend);
        }
        catch (e){
            next(e)
        }
    }
    async cancelFlQuery(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const {friendId} = req.body
            const cancelQuery = await userService.cancelQuery(refreshToken, friendId);
            res.json(cancelQuery);
        }
        catch (e){
            next(e)
        }
    }
    async getFriends(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const friends = await userService.getFriends(refreshToken);
            res.json(friends);
        }
        catch (e){
            next(e)
        }
    }
}

module.exports = new userController();