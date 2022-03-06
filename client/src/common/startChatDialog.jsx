import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Stack, Alert, CircularProgress } from '@mui/material';
import FriendsSelect from './friendsSelect';
import ParticipantsList from './participantsList';
import { findIndex } from 'lodash';
import { chatService } from  '../services/chatService';
import { useHistory } from "react-router-dom";

export default function StartChatDialog(props) {
    const {handleCloseStartChatDialog, selectedParticipants = []} = props;

    const [participants, setParticipants] = React.useState(selectedParticipants);
    const [chatName, setChatName] = React.useState("");
    const [error, setError] = React.useState("");
    const [isCreatingChat, setIsCreatingChat] = React.useState(false);

    const history = useHistory();

    const addParticipant = (newParticipant) => {
        setParticipants((currentParticipants) => {
            const isAlreadyAddedAsParticipant = findIndex(currentParticipants, function(participant) {
                return newParticipant._id === participant._id;
            }) !== -1;
            
            if(isAlreadyAddedAsParticipant) {
                return [...currentParticipants];
            }
            
            return [...currentParticipants, newParticipant];
        });
    }

    const removeParticipant = (participantId) => {
        setParticipants((currentParticipants) => {
            const updatedParticipants = currentParticipants.filter((participant) => participant._id !== participantId);
            return updatedParticipants;
        });
    }

    const handleChangeChatName = (e) => {
        setChatName(e.target.value);
    }

    const handleClickCreateChat = () => {
        setError("");
        if(participants.length === 0) {
            setError("You must select one participant.")
            return;
        }

        setIsCreatingChat(true);
        const participantIds = participants.map((participant) => participant._id);
        chatService.createChat(participantIds, chatName ? chatName : null)
                    .then((response) => {
                        setIsCreatingChat(false);
                        handleCloseStartChatDialog();
                        history.push(`/chats/${response.chatId}`);
                    })
                    .catch((error) => {
                        setIsCreatingChat(false);
                        setError(error.error);
                    });
    }

    return (
        <Dialog open={true} onClose={handleCloseStartChatDialog} fullWidth={true} maxWidth='sm' >
            <DialogTitle>
                Start a new chat
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    {
                        error && 
                        <Alert severity="error">{error}</Alert>
                    }
                    <TextField
                        autoFocus
                        margin="dense"
                        id="chat-name"
                        label="Give your chat a name (optional)"
                        fullWidth
                        variant="outlined"
                        value={chatName}
                        onChange={handleChangeChatName}
                    />
                    <FriendsSelect handleSelectFriend={addParticipant} />
                    <ParticipantsList participants={participants} removeParticipant={removeParticipant} />
                </Stack>
                {isCreatingChat && 
                    <CircularProgress sx={{float: "right"}}/>
                }
                {!isCreatingChat &&
                    <DialogActions>
                        <Button onClick={handleCloseStartChatDialog}>Cancel</Button>
                        <Button onClick={handleClickCreateChat}>Create</Button>
                    </DialogActions>
                }
            </DialogContent>
        </Dialog>
    );
}