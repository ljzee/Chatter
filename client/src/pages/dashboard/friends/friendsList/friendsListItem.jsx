import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { MoreVert as MoreVertIcon, ChatBubble as ChatBubbleIcon} from '@mui/icons-material';
import { Typography, IconButton, Avatar, Divider, Box, Menu, MenuItem } from '@mui/material';
import StatusBadge from '../../../../common/statusBadge';
import {getImageUrl} from '../../../../helpers/urlHelper';
import RemoveFriendConfirmationDialog from './removeFriendConfirmationDialog';
import StartChatDialog from '../../../../common/startChatDialog';

function getStatusText(status) {
    let statusText = "Unknown";

    switch(status) {
        case "active":
            statusText = "Active";
            break;
        case "idle":
            statusText = "Idle";
            break;
        case "offline":
            statusText = "Offline";
            break;
    }

    return statusText;
}

export default function FriendsListItem(props) {
    const [startChatDialogOpen, setStartChatDialogOpen] = React.useState(false);

    const [friendMenuAnchorEl, setFriendMenuAnchorEl] = React.useState(null);
    const [removeFriendConfirmationDialogOpen, setRemoveFriendConfirmationDialogOpen] = React.useState(false);
    
    const friendMenuOpen = Boolean(friendMenuAnchorEl);
    const handleClickFriendMenu = (event) => {
        setFriendMenuAnchorEl(event.currentTarget);
    };

    const handleCloseFriendMenu = () => {
        setFriendMenuAnchorEl(null);
    };

    const handleCloseRemoveFriendConfirmationDialog = () => {
        setRemoveFriendConfirmationDialogOpen(false);
    }

    const handleOpenRemoveFriendConfirmationDialog = () => {
        setRemoveFriendConfirmationDialogOpen(true);
        handleCloseFriendMenu();
    }

    const handleOpenStartChatDialog = () => {
        setStartChatDialogOpen(true);
    };
    
    const handleCloseStartChatDialog = () => {
        setStartChatDialogOpen(false);
    };

    const theme = useTheme();

    const {friend, getUserFriends} = props;

    return (
        <React.Fragment>
            <Box sx={sxBox}>
                <StatusBadge 
                    status={friend.status}  
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={sxStatusBadge} 
                >
                    <Avatar src={getImageUrl(friend.profileImageFilename)}/>
                </StatusBadge>
                <Box>
                    <Typography variant="body1" component="div">
                        {friend.username}
                    </Typography>
                    <Typography variant="subtitle2" component="div" sx={sxStatusTypography(theme)} >
                        {getStatusText(friend.status)}
                    </Typography>
                </Box>
                <Box sx={sxSeparatorBox} />
                <IconButton onClick={handleOpenStartChatDialog}>
                    <ChatBubbleIcon/>
                </IconButton>
                <IconButton onClick={handleClickFriendMenu}>
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={friendMenuAnchorEl}
                    open={friendMenuOpen}
                    onClose={handleCloseFriendMenu}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleOpenRemoveFriendConfirmationDialog}>
                        Remove
                    </MenuItem>
                </Menu>
                {removeFriendConfirmationDialogOpen && 
                 <RemoveFriendConfirmationDialog 
                    username={friend.username} 
                    id={friend._id} 
                    handleClose={handleCloseRemoveFriendConfirmationDialog} 
                    getUserFriends={getUserFriends} 
                 />}
                {startChatDialogOpen && 
                 <StartChatDialog 
                    handleCloseStartChatDialog={handleCloseStartChatDialog} 
                    selectedParticipants={[friend]} 
                 />}
            </Box>
            <Divider/>
        </React.Fragment>
    );
}

const sxBox = {
    display: "flex",
    alignItems: "center",
    padding: 2
};

const sxStatusBadge = {
    marginRight: 2
};

const sxStatusTypography = (theme) => ({
    color: theme.palette.text.secondary
});

const sxSeparatorBox = {
    flexGrow: 1
};