const ChatModel = require('../models/chatModel');
const MessageModel = require('../models/messageModel');
const UserManager = require('../classes/UserManager');

module.exports = {
    createChat,
    getUserChats,
    getUserChatIds,
    isUserPartOfChat,
    getChat,
    saveMessage,
    getChatParticipantIds
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
    chat = await chat.save();

    await chat.populate("participants", "username");

    return chat;
}

async function getUserChats(userId) {
    const chats = await ChatModel.find({
        "participants": userId
    })
    .populate("participants", "username")
    .exec();

    const chatIds = chats.map(chat => chat._id);
    const chatsLatestMessage = await MessageModel.aggregate([
        {
            $match: {
                chat: {
                    $in: chatIds
                }
            }
        },
        {
            $sort: {
                sendAt: -1
            }
        },
        {
            $group: {
                _id: "$chat",
                lastestSentAt: { 
                    $last: "$sentAt" 
                }
            }
        }
    ])
    .exec();

    const chatIdToLatestSentAt = {};
    for(const message of chatsLatestMessage) {
        chatIdToLatestSentAt[message._id.toString()] = message.lastestSentAt;
    }

    const chatObjects = [];
    for(const chat of chats) {
        const chatObject = chat.toObject();
        chatObject.latestSentAt = chatIdToLatestSentAt.hasOwnProperty(chat._id.toString()) ?
                                      chatIdToLatestSentAt[chat._id.toString()] :
                                      null;
        chatObjects.push(chatObject);
    }

    return chatObjects;
}

async function getUserChatIds(userId) {
    const chats = await ChatModel.find({
        "participants": userId 
    })
    .exec();

    return chats.map(chat => chat._id.toString());
}

async function isUserPartOfChat(userId, chatId) {
    const chat = await ChatModel.findById(chatId);
    if(!chat) {
        return false;
    }
    
    const participantIds = chat.participants.map(participant => participant._id.toString());
    return participantIds.includes(userId);
}

async function getChat(chatId) {
    const chatDocument = await ChatModel.findById(chatId)
                                .populate("participants", "_id username")
                                .exec();

    const chatObject = chatDocument.toObject();

    chatObject.messages = await getMostRecentMessagesForChat(chatId);
    for(const participant of chatObject.participants) {
        participant.status = UserManager.getUserStatus(participant._id.toString());
    }

    return chatObject;
}

async function getMostRecentMessagesForChat(chatId, count = 100) {
    const messageDocuments = await MessageModel.find({
        chat: chatId
    })
    .sort('-sentAt')
    .limit(count)
    .populate('sender', '_id username')
    .exec();

    const messageObjects = messageDocuments.map(messageDocument => messageDocument.toObject());

    return messageObjects.reverse();
}

async function saveMessage(chatId, senderId, message) {
    let messageDocument = new MessageModel({
        sender: senderId,
        contents: message,
        chat: chatId
    });
    
    const newMessageDocument = await messageDocument.save();

    await newMessageDocument.populate([{
        path: 'sender', 
        select: 'username'
    }, {
        path: 'chat',
        select: 'chatName',
        populate: {
            path: 'participants',
            select: 'username'
        }
    }]);

    return newMessageDocument;
}

async function getChatParticipantIds(chatId) {
    const chat = await ChatModel.findById(chatId);

    return chat.participants.map(participant => participant._id.toString());
}