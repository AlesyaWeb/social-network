const ChatRoomModel = require('../Models/ChatRoom');
const MessageModel = require('../Models/chatMessage');
const UserInfoModel = require('../Models/userInfo')
require('mongoose')
const mongoose = require('mongoose')
const uuid = require('uuid');
const ApiError = require('../exceptions/api-errors');
const fs = require('fs')
const tokenService = require("./token-service");
class ChatService {
    async initiateChat(userIds, type, refreshToken) {
        console.log(refreshToken)
        const userData = tokenService.validateRefreshToken(refreshToken);
        console.log(userData)
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let chatInitiator = userData.id;
        const userIdsExt = [userIds, chatInitiator]
        console.log(userIds)
        const availableRoom = await ChatRoomModel.findOne({
            userIds: {$all : [...userIdsExt]}
        });
        console.log(availableRoom)
        if (availableRoom) {
            return {
                isNew: false,
                message: 'retrieving an old chat room',
                chatRoomId: availableRoom._doc._id,
                type: availableRoom._doc.type,
            };
        }
        const newRoom = await ChatRoomModel.create({ userIds: userIdsExt, type, chatInitiator });
        return {
            isNew: true,
            message: 'creating a new chatroom',
            chatRoomId: newRoom._doc._id,
            type: newRoom._doc.type,
        };
    }
    async createPostInChatRoom(chatRoomId, message, refreshToken) {
        console.log(message)
        const userData = tokenService.validateRefreshToken(refreshToken);
        console.log(userData)
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let postedByUser = userData.id;
        const postMessage = await MessageModel.create({
            chatRoomId,
            message,
            postedByUser,
            readByRecipients: { readByUserId: postedByUser }
        });

        const aggregate = await MessageModel.aggregate([
            { $match: { _id: postMessage._id } },
            {
                $lookup: {
                    from: 'userinfos',
                    localField: 'postedByUser',
                    foreignField: 'user',
                    as: 'postedByUser',
                }
            },
            { $unwind: '$postedByUser' },
            {
                $lookup: {
                    from: 'chatrooms',
                    localField: 'chatRoomId',
                    foreignField: '_id',
                    as: 'chatRoomInfo',
                }
            },
            { $unwind: '$chatRoomInfo' },
            { $unwind: '$chatRoomInfo.userIds' },
            {
                $lookup: {
                    from: 'userinfos',
                    localField: 'chatRoomInfo.userIds',
                    foreignField: 'user',
                    as: 'chatRoomInfo.userProfile',
                }
            },
            { $unwind: '$chatRoomInfo.userProfile' },
            {
                $group: {
                    _id: '$chatRoomInfo._id',
                    postId: { $last: '$_id' },
                    chatRoomId: { $last: '$chatRoomInfo._id' },
                    message: { $last: '$message' },
                    type: { $last: '$type' },
                    postedByUser: { $last: '$postedByUser' },
                    readByRecipients: { $last: '$readByRecipients' },
                    chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
                    createdAt: { $last: '$createdAt' },
                    updatedAt: { $last: '$updatedAt' },
                }
            }
        ])
        return aggregate[0];
    }
    async getConversationById(chatRoomId) {
        const room = await ChatRoomModel.findOne({ _id: chatRoomId })
        if (!room) throw ApiError.BadRequest('No room id in query params or room doesnt exists');
        let objectedRoomId = mongoose.Types.ObjectId(chatRoomId);
        const conversation = await MessageModel.aggregate([
            { $match: { chatRoomId: objectedRoomId } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'userinfos',
                    localField: 'postedByUser',
                    foreignField: 'user',
                    as: 'postedByUser',
                }
            },
            { $sort: { createdAt: 1 } },
            { $unwind: "$postedByUser" },
        ]);
        const users = await UserInfoModel.find({user: room.userIds});
        return {
            conversation,
            users
        }
    }
    async markConversationReadByRoomId(RoomId, refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let readByUserId = userData.id;
        console.log(readByUserId)
        const room = await ChatRoomModel.findOne({ _id: RoomId })
        if (!room) throw ApiError.BadRequest('No room id in query params or room doesnt exists');
        let chatRoomId = mongoose.Types.ObjectId(RoomId);
        console.log(chatRoomId)
        let objectedReadByUserId = mongoose.Types.ObjectId(readByUserId);
        const getMess = await MessageModel.findOne({
            message: "i am new message"
        })
        console.log(getMess.message)
        const result = await MessageModel.updateMany(
            {
                chatRoomId,
                'readByRecipients.readByUserId': { $ne: readByUserId }
            },
            {
                $addToSet: {
                    readByRecipients: { readByUserId: readByUserId }
                }
            },
            {
                multi: true
            }
        );
        return {
            result
        }
    }
    async getAllConversations (refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const rooms = await ChatRoomModel.find({userIds: userData.id} )
        let allUsers = []
        for(let i = 0; i < rooms.length; i++){
            console.log(i)
            const users = await UserInfoModel.find({user: rooms[i].userIds});
            allUsers.push(users)
        }
        return {rooms, allUsers}
    }
}


module.exports = new ChatService();