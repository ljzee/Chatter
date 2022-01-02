const UserService = require('../services/userService');

exports.getFriends = async (req, res, next) => {
    try{
        const friends = await UserService.getUserFriends(req.user.sub);
    
        return res.status(200).json({
            friends: friends
        });
    } catch(error) {
        next(error);
    }
}