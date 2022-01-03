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