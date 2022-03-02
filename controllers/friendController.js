const UserService = require('../services/userService');

exports.getFriends = async (req, res, next) => {
    try{
        const friends = await UserService.getUserFriends(req.user.sub, req.query.searchValue);
    
        return res.status(200).json({
            friends: friends
        });
    } catch(error) {
        next(error);
    }
}

exports.removeFriend = async (req, res, next) => {
    try {
        const areUserFriends = await UserService.isUserFriendsWithUser(req.user.sub, req.params.friendId);
        if(!areUserFriends) {
            return res.sendStatus(403);
        }

        await UserService.unfriendUsers(req.user.sub, req.params.friendId);

        res.sendStatus(200);
    } catch(error) {
        next(error);
    }
}