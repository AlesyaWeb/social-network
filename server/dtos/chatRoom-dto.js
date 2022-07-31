module.exports = class ChatRoomDto {
    id;
    userIds;
    type;
    chatInitiator;
    constructor(model) {
        this.id = model._id;
        this.userIds = model.userIds;
        this.type = model.type;
        this.chatInitiator = model.chatInitiator;
    }
}