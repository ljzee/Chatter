import * as React from 'react';
import { ListItem, ListItemAvatar, ListItemText, ListItemButton, Typography, Avatar, IconButton } from '@mui/material';
import { Close as CloseIcon, Chat as ChatIcon } from '@mui/icons-material';
import { useHistory, useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import {chatService} from '../../../../../services/chatService';

export default function ChatsListItem(props) {
    let history = useHistory();
    let location = useLocation();
    
    const {chat, removeChat} = props;

    const handleClickChat = () => {
        history.push(`/chats/${chat._id}`);
    }

    const handleClickCloseChat = (e) => {
        chatService.leaveChat(chat._id)
                   .then(() => {
                       removeChat(chat._id);
                   })
                   .catch(() => {
                       alert("Unable to remove chat. Please try again later.");
                   });
    }

    let chatName = chat.chatName;
    if(!chatName) {
        const participantUsernames = chat.participants.map(participant => participant.username);
        chatName = participantUsernames.join(", ");
    }

    const numberOfParticipants = chat.participants.length;

    const theme = useTheme();

    return (
        <ListItem
            secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={handleClickCloseChat}>
                    <CloseIcon sx={sxCloseIcon}/>
                </IconButton>
            }
            disablePadding
            dense
        >
            <ListItemButton onClick={handleClickChat} className="navigation-tab" selected={location.pathname === `/chats/${chat._id}`}>
                <ListItemAvatar sx={sxListItemAvatar}>
                    <Avatar sx={sxAvatar}>
                        <ChatIcon sx={sxChatIcon}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    sx={sxListItemText}
                    primary={<Typography sx={sxPrimaryTypography}>{chatName}</Typography>}
                    secondary={<Typography sx={sxSecondaryTypography(theme)}>{`${numberOfParticipants} Participants`}</Typography>}
                />
            </ListItemButton>
        </ListItem>
    );
}

const sxCloseIcon = {
    width: "0.8em",
    height: "0.8em"
};

const sxListItemAvatar = {
    minWidth: "40px"
};

const sxAvatar = {
    width: "30px",
    height: "30px"
};

const sxChatIcon = {
    position: "relative",
    top: "1px",
    fontSize: "0.9em"
};

const sxListItemText = {
    marginTop: "3px",
    marginBottom: "3px"
};

const sxPrimaryTypography = {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "121px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "0.9rem"
};

const sxSecondaryTypography = (theme) => ({
    fontSize: "0.75rem",
    color: theme.palette.text.secondary
});