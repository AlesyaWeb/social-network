const UserModel = require('../Models/User');
const bcrypt = require('bcryptjs');
require('mongoose')
const uuid = require('uuid');
const mailService = require('../service/mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-errors');
const UserInfo = require("../Models/userInfo");
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
// const fs = require('fs')
const UserInfoDto = require("../dtos/userInfo-dto");
const mongoose = require("mongoose");
// const {userInfo} = require("os");
// const ageCalc = require("../Utils/ageCalc");
class UserService {
    async registration(email, password, userData) {
            const candidate = await UserModel.findOne({email})
            if(candidate) {
                throw ApiError.BadRequest(`Пользователь с почтой ${email} уже существует`);
            }
            const hashPassword = await bcrypt.hash(password, 3);
            const activationLink = uuid.v4()
            const user = await UserModel.create({email, password: hashPassword, activationLink})
            await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activation/${activationLink}`);
            const userDto = new UserDto(user)
            const newUserInfo = await UserInfo.create({
                user: userDto.id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                description: userData.description,
                photo_50: userData.photo_50,
                gender: userData.gender,
                age: userData.age
            })
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {
                ...tokens,
                user: userDto
            }
    }
    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if(!user) {
            throw ApiError.BadRequest('Incorrect accept link');
        }
        user.isActivated = true;
        await user.save();
    }
    async login(email, password) {
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest('User wasnt found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Incorrect password');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
            resultCode: 0
        }
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return {
            token,
            resultCode: 0
        }
    }
    async refresh(refreshToken) {
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }
    async getAllUsers() {
        const users = await UserInfo.find();
        return users;
    }
    async getUserProfile(id) {
        const userProfile = await UserInfo.findOne({user: id})
        return userProfile
    }
    async getCurrentUser(refreshToken) {
        console.log('-----------------------------------------------------------')
        console.log(refreshToken)
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let uId = userData.id;
        const user = await UserInfo.findOne({user: uId});
        const userInfoDto = new UserInfoDto(user);
        return{
            user: userInfoDto,
            resultCode: 0
        }
    }
    async updateStatus(refreshToken, newStatus) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let uId = userData.id;
        const updateStatus = await UserInfo.updateOne({user: uId}, {$set: {status: newStatus}});
        const updatedStatus = await UserInfo.findOne({user: uId}, "status")
        return{
            newStatus: updatedStatus.status,
            resultCode: 0
        }
    }
    async setUserAvatar(refreshToken, avatar) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let uId = userData.id;
        let avatarUrl = '';
        await cloudinary.uploader.upload(avatar.tempFilePath, async (err, result) => {
            avatarUrl = result.url
            const updateStatus = await UserInfo.updateOne({user: uId}, {$set: {photo_50: avatarUrl}});
        })
        // console.log('--------------------------------------------------------------------')
        // await avatar.mv('uploads/'+avatarName)
        // const userAvatarUrl = "https://socnet-backend.herokuapp.com/uploads/"+avatarName
        // const updateStatus = await UserInfo.updateOne({user: uId}, {$set: {photo_50: userAvatarUrl}});
        return{
            resultCode: 0,
            avatar: avatarUrl
        }
    }
    async editProfile(refreshToken, dataToEdit) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let uId = userData.id;
        let editProfileData = {}
        for (const key of Object.keys(dataToEdit)) {
            dataToEdit['description'] ? editProfileData.description = dataToEdit['description'] : null
            // dataToEdit['age'] ? editProfileData.age = ageCalc(dataToEdit['age']) : editProfileData.age = 10
        }
        const editProfile = await UserInfo.updateMany({user: uId}, {$set: editProfileData});
        return{
            resultCode: 0,
            editProfile: editProfileData
        }
    }
    async addToFriendsQuery(refreshToken, to) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let from = userData.id;
        const isFriendExists = await UserInfo.findOne({user: mongoose.Types.ObjectId(to), friends: {$exists: true, $in: from}})
        const isConsumerExists = await UserInfo.findOne({user: mongoose.Types.ObjectId(to)})
        const isQueryExistsFrom = await UserInfo.findOne({user: mongoose.Types.ObjectId(from), sentFlQueries: {$exists: true, $in: to}})
        const isQueryExistsTo = await UserInfo.findOne({user: mongoose.Types.ObjectId(to), sentFlQueries: {$exists: true, $in: from}})
        if(isFriendExists){
            throw ApiError.BadRequest('User is already in ur friends list');
        }
        if(!isConsumerExists){
            throw ApiError.BadRequest(`There are no user with id ${to}`);
        }
        if(isQueryExistsFrom || isQueryExistsTo){
            throw ApiError.BadRequest(`U already sent query to this user`);
        }
        // const addQuery = sender.updateOne({$set: {friends: {$push: {senderFriendsList}, sentQueries: {to}}}})
        const sender = await UserInfo.updateOne({user: mongoose.Types.ObjectId(from)}, {$push: {sentFlQueries: to}})
        const consumer = await UserInfo.updateOne({user: mongoose.Types.ObjectId(to)}, {$push: {waitingFlAccept: from}})
        return {
            sender,
            consumer
        }
    }
    async acceptFriendQuery(refreshToken, from) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let userId = userData.id;
        const isQueryExists = await UserInfo.findOne({user: mongoose.Types.ObjectId(userId), waitingFlAccept: {$exists: true, $in: from}})
        if(!isQueryExists){
            throw ApiError.BadRequest(`There are no query of this user`);
        }
        const sender = await UserInfo.findOne({user: mongoose.Types.ObjectId(from)})
        const updateSender = await UserInfo.updateMany({user: mongoose.Types.ObjectId(from)}, {$pull: {sentFlQueries: {$in: userId}}, $push: {friends: userId}})
        const updateConsumer = await UserInfo.updateMany({user: mongoose.Types.ObjectId(userId)}, {$pull: {waitingFlAccept: {$in: from}}, $push: {friends: from}})
        return {
            sender
        }
    }
    async rejectFriendQuery(refreshToken, from) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let userId = userData.id;
        const isQueryExists = await UserInfo.findOne({user: mongoose.Types.ObjectId(userId), waitingFlAccept: {$exists: true, $in: from}})
        if(!isQueryExists){
            throw ApiError.BadRequest(`There are no query of this user`);
        }
        const sender = await UserInfo.updateMany({user: mongoose.Types.ObjectId(from)}, {$pull: {sentFlQueries: {$in: userId}}})
        const consumer = await UserInfo.updateMany({user: mongoose.Types.ObjectId(userId)}, {$pull: {waitingFlAccept: {$in: from}}})
        return {
            sender,
            consumer
        }
    }
    async deleteFriend(refreshToken, friendId) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let userId = userData.id;
        const isFriendExists = await UserInfo.findOne({user: mongoose.Types.ObjectId(userId), friends: {$exists: true, $in: friendId}})
        if(!isFriendExists){
            throw ApiError.BadRequest(`There are no user with id ${friendId} in ur friends list`);
        }
        const friend = await UserInfo.updateMany({user: mongoose.Types.ObjectId(friendId)}, {$pull: {friends: {$in: userId}}})
        const owner = await UserInfo.updateMany({user: mongoose.Types.ObjectId(userId)}, {$pull: {friends: {$in: friendId}}})
        return {
            friend,
            owner
        }
    }
    async cancelQuery(refreshToken, friendId) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let userId = userData.id;
        const isQueryExists = await UserInfo.findOne({user: mongoose.Types.ObjectId(userId), sentFlQueries: {$exists: true, $in: friendId}})
        if(!isQueryExists){
            throw ApiError.BadRequest(`There are no query to this user`);
        }
        const sender = await UserInfo.updateMany({user: mongoose.Types.ObjectId(userId)}, {$pull: {sentFlQueries: {$in: friendId}}})
        const consumer = await UserInfo.updateMany({user: mongoose.Types.ObjectId(friendId)}, {$pull: {waitingFlAccept: {$in: userId}}})
        return {
            sender,
            consumer
        }
    }
    async getFriends(refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let userId = userData.id;
        const user = await UserInfo.findOne({user: mongoose.Types.ObjectId(userId)})
        const friendsIds = user.friends
        const sentFlQueries = user.sentFlQueries
        const waitingFlAccept = user.waitingFlAccept
        let friends = []
        for(let i = 0; i<friendsIds.length; i++){
            console.log(i)
            console.log(friendsIds[i])
            const friend = await UserInfo.findOne({user: mongoose.Types.ObjectId(friendsIds[i])})
            friends.push(friend)
        }
        return {
            friends,
            sentFlQueries,
            waitingFlAccept
        }
    }
}


module.exports = new UserService();