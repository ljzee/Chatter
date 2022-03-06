import * as React from 'react';
import ChatHeaderContainer from "../chatHeaderContainer";
import { Box, Typography, Divider, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { PersonAdd as PersonAddIcon, PeopleAlt as PeopleIcon } from '@mui/icons-material';
import ParticipantsMenu from './participantsMenu';
import AddParticipantsDialog from './addParticipantsDialog';

export default function ChatHeaderLoaded(props) {
   const [addParticipantsDialogOpen, setAddParticipantsDialogOpen] = React.useState(false);
   const [participantsMenuAnchorEl, setParticipantsMenuAnchorEl] = React.useState(null);
   const participantsMenuOpen = Boolean(participantsMenuAnchorEl);

   const handleClickParticipantsMenu = (e) => {
        setParticipantsMenuAnchorEl(e.currentTarget);
   }

   const handleCloseParticipantsMenu = () => {
        setParticipantsMenuAnchorEl(null);
   }

   const handleOpenAddParticipantsDialog = () => {
        setAddParticipantsDialogOpen(true);
   };

   const handleCloseAddParticipantsDialog = () => {
        setAddParticipantsDialogOpen(false);
   };

   const {chatId, chatName, participants} = props;

   return (
    <ChatHeaderContainer>
        <Box sx={sxBox}>
            <Box sx={sxChatNameBox}>
                <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                {chatName}
                </Typography>
            </Box>
            <Box sx={sxChatControlsBox}>
                <IconButton onClick={handleClickParticipantsMenu}>
                    <PeopleIcon />
                </IconButton>
                <Divider orientation="vertical" flexItem sx={sxDivider} />
                <IconButton onClick={handleOpenAddParticipantsDialog}>
                    <PersonAddIcon/>
                </IconButton>
                {
                    addParticipantsDialogOpen &&
                    <AddParticipantsDialog chatId={chatId} handleCloseAddParticipantsDialog={handleCloseAddParticipantsDialog} currentParticipants={participants}/>
                }
                <ParticipantsMenu 
                    participants={participants} 
                    participantsMenuAnchorEl={participantsMenuAnchorEl} 
                    participantsMenuOpen={participantsMenuOpen} 
                    handleCloseParticipantsMenu={handleCloseParticipantsMenu} 
                />
            </Box>
        </Box>
    </ChatHeaderContainer>
   );
};

const sxBox = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    paddingLeft: "24px",
    paddingRight: "24px"
};

const sxChatNameBox = {
    display: "flex", 
    alignItems: "center"
};

const sxChatControlsBox = sxChatNameBox;

const sxDivider = {
    margin: "5px"
};