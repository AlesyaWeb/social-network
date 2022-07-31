const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-errors');
const chatRoomService = require('../service/chatRoom-service');
const api = require('../api');
class chatRoomController {
    async initiateChat (req, res, next) {
        try {
        // Я остановился на том, что создал chatRoom mongodb схему, так же chatRoomDto, добавил эндопоинт
        // /room/initiate, при запросе на который вызывается метод initiateChat
            console.log(req.body)
            const {userIds, type} = req.body
            const {refreshToken} = req.cookies;
            const allUserIds = [...userIds];
            const chatRoom = await chatRoomService.initiateChat(userIds, type, refreshToken)
            return res.json(chatRoom);
        }
        catch (e){
            next(e);
        }
    }
    async createPostInChatRoom (req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const {message} = req.body
            const {roomId} = req.params
            const {receiverId} = req.body
            console.log('------------------------------')
            console.log(req.body)
            console.log(message)
            console.log(receiverId, 'receiverId')
            console.log(roomId)
            console.log('------------------------------')
            const chatMessage = await chatRoomService.createPostInChatRoom(roomId, message, refreshToken)
            // let users = Object.keys(global.io.engine.clients)
            // function getUser(userId) {
            //     return users.find((user) => user.userId === userId);
            // }
            // const user = getUser(receiverId);
            global.io.to(Object.keys(global.io.engine.clients)).emit('getMessage', {message: chatMessage})
            // console.log(users)
            // console.log(users.find(gIDMeYQJ1br_wepJAAAH(user) => user.userId === receiverId))
            // global.io.to(users.find((user) => user.userId === receiverId)).emit('new message', { message: chatMessage })
            return res.json(chatMessage)
        }
        catch (e){
            next(e)
        }
    }
    async getConversationByRoomId (req, res, next) {
        try{
            const {roomId} = req.params
            const room = await chatRoomService.getConversationById(roomId)
            res.json(room)
        }
        catch (e){
            next(e)
        }
    }
    async markConversationReadByRoomId (req, res, next) {
        try{
            const {roomId} = req.params
            const {refreshToken} = req.cookies;
            const result = await chatRoomService.markConversationReadByRoomId(roomId, refreshToken)
            res.json("success")
        }
        catch (e){
            next(e)
        }
    }
    async getAllConversations (req, res, next) {
        try{
            console.log('hello')
            const {refreshToken} = req.cookies;
            const rooms = await chatRoomService.getAllConversations(refreshToken)
            res.json(rooms)
        }
        catch (e){
            next(e)
        }
    }
}

module.exports = new chatRoomController();