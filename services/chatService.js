const ChatModel = require('../models/chatModel');

module.exports = {
    createChat,
    getUserChats
};
  
async function createChat(creatorId, participantIds, chatName = null) {
    let chatObj = {
        creator: creatorId,
        participants: [creatorId, ...participantIds]
    }

    if(chatName) {
        chatObj.chatName = chatName;
    }
    
    let chat = new ChatModel(chatObj);
    
    return await chat.save();
}

async function getUserChats(userId) {
    const chatDocuments = await ChatModel.find({
        "participants": userId
    })
    .exec();

    const chats = await Promise.all(chatDocuments.map(async (chatDocument) => {
        return {
            id: chatDocument._id.toString(),
            chatName: chatDocument.chatName,
            participants: await chatDocument.getParticipantUsernames()
        };
    }));

    return chats;
}