const UserService = require('../services/userService');
const ChatService = require('../services/chatService');
const ValidationHelper = require('./validationHelper');
const {body} = require("express-validator");
var UserManager = require('../classes/UserManager');

exports.createChat = [
    body('chatName')
        .trim(),
    body('participants')
        .isArray({
            min: 1
        })
        .withMessage("You must select one participant to begin chatting."),
    ValidationHelper.processValidationResults,
    async (req, res, next) => {
        try{ 
            const {chatName, participants} = req.body;
            
            const isUserFriendsWithParticipants = await UserService.isUserFriendsWithUsers(req.user.sub, participants);
            if(!isUserFriendsWithParticipants) {
                return res.status(400).json({
                    error: "You are not friends with one or more participants."
                });
            }

            const chat = await ChatService.createChat(req.user.sub, participants, chatName);

            // Make online participants join the chat room
            for(const participant of chat.participants) {
                const participantId = participant._id.toString();
                if(UserManager.hasUser(participantId)) {
                    const user = UserManager.getUser(participantId);
                    user.joinChat(chat._id.toString());
                }
            }

            // Send a socket message to the chat creator with chat details
            if(UserManager.hasUser(req.user.sub)) {
                const user = UserManager.getUser(req.user.sub);
                user.sendEvent("create-new-chat", chat);
            }

            return res.json({
                chatId: chat._id.toString()
            });
        } catch(error) {
            next(error);
        }
    }
]

exports.getUserChats = async (req, res, next) => {
    const chats = await ChatService.getUserChats(req.user.sub);

    return res.json({
        chats: chats
    });
}

exports.getChat = async (req, res, next) => {
    const chatId = req.params.chatId;
    const isUserPartOfChat = await ChatService.isUserPartOfChat(req.user.sub, chatId);

    if(!isUserPartOfChat) {
        return res.sendStatus(403);
    }

    const chat = await ChatService.getChat(chatId);

    return res.json(chat);
}

exports.getMessages = async (req, res, next) => {
    const chatId = req.params.chatId;
    const isUserPartOfChat = await ChatService.isUserPartOfChat(req.user.sub, chatId);

    if(!isUserPartOfChat) {
        return res.sendStatus(403);
    }

    const offset = req.query.hasOwnProperty("offset") ? parseInt(req.query.offset, 10) : 0;

    const moreMessages = await ChatService.getMostRecentMessages(chatId, 10, offset);

    const response = {
        messages: moreMessages,
        hasMoreMessages: await ChatService.hasMoreMessages(chatId, offset + moreMessages.length)
    }

    return res.json(response);
}

exports.sendMessage = async (req, res, next) => {
    const chatId = req.params.chatId;
    const isUserPartOfChat = await ChatService.isUserPartOfChat(req.user.sub, chatId);

    if(!isUserPartOfChat) {
        return res.sendStatus(403);
    }

    const newMessage = await ChatService.saveMessage(chatId, req.user.sub, req.body.message);
    
    const io = require('../helper/io').io();
    io.to(chatId).emit("new-message", newMessage);

    return res.sendStatus(200);
}

exports.getParticipantsStatus = async (req, res, next) => {
    const chatId = req.params.chatId;
    const isUserPartOfChat = await ChatService.isUserPartOfChat(req.user.sub, chatId);

    if(!isUserPartOfChat) {
        return res.sendStatus(403);
    }

    const chatParticipantIds = await ChatService.getChatParticipantIds(chatId);
    const participantsStatus = chatParticipantIds.map(participantId => ({
        participantId: participantId,
        status: UserManager.getUserStatus(participantId)
    }));

    return res.json({
        participantsStatus: participantsStatus
    });
}

exports.leaveChat = async (req, res, next) => {
    const chatId = req.params.chatId;
    const isUserPartOfChat = await ChatService.isUserPartOfChat(req.user.sub, chatId);

    if(!isUserPartOfChat) {
        return res.sendStatus(403);
    }

    await ChatService.removeUserFromChat(chatId, req.user.sub);

    if(UserManager.hasUser(req.user.sub)) {
        const user = UserManager.getUser(req.user.sub);
        user.leaveChat(chatId);
    }

    const io = require('../helper/io').io();
    io.to(chatId).emit("leave-chat", {
        chatId: chatId,
        userId: req.user.sub
    });

    return res.sendStatus(200);
}

exports.addChatParticipants = async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const isUserPartOfChat = await ChatService.isUserPartOfChat(req.user.sub, chatId);

        if(!isUserPartOfChat) {
            return res.sendStatus(403);
        }

        const {participantIds} = req.body;
        if(typeof participantIds === "undefined" || !Array.isArray(participantIds)) {
            return res.sendStatus(400);
        }

        if(participantIds.length === 0) {
            return res.status(400).json({
                error: "You must select one participant to add."
            });
        }
        
        const isUserFriendsWithParticipants = await UserService.isUserFriendsWithUsers(req.user.sub, participantIds);
        if(!isUserFriendsWithParticipants) {
            return res.status(400).json({
                error: "You are not friends with one or more participants."
            });
        }

        const participantIdsAdded = await ChatService.addChatParticipants(chatId, participantIds);

        for(const participantId of participantIdsAdded) {
            if(UserManager.hasUser(participantId)) {
                const user = UserManager.getUser(participantId);
                user.joinChat(chatId);
            }
        }

        const io = require('../helper/io').io();
        io.to(chatId).emit("add-participants", {
            chatId: chatId
        });

        return res.sendStatus(200);
    } catch(error) {
        next(error);
    }
}

exports.getParticipants = async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const isUserPartOfChat = await ChatService.isUserPartOfChat(req.user.sub, chatId);

        if(!isUserPartOfChat) {
            return res.sendStatus(403);
        }

        const participants = await ChatService.getParticipants(chatId);

        return res.json({
            participants
        });
    } catch(error) {
        next(error);
    }
}