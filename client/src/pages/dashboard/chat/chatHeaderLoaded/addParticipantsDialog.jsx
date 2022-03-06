import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Stack, Alert, CircularProgress } from '@mui/material';
import FriendsSelect from '../../../../common/friendsSelect';
import ParticipantsList from '../../../../common/participantsList';
import { findIndex } from 'lodash';
import { chatService } from  '../../../../services/chatService';

export default function AddParticipantsDialog(props) {
    const {chatId, handleCloseAddParticipantsDialog, currentParticipants = []} = props;

    const [participants, setParticipants] = React.useState([]);
    const [error, setError] = React.useState("");
    const [isAddingParticipants, setIsAddingParticipants] = React.useState(false);

    const addParticipant = (newParticipant) => {
        setParticipants((addedParticipants) => {
            const isAlreadyAParticipant = findIndex(currentParticipants, function(participant) {
                return newParticipant._id === participant._id;
            }) !== -1;

            const isCurrentlyAddedAsParticipant = findIndex(addedParticipants, function(participant) {
                return newParticipant._id === participant._id;
            }) !== -1;
            
            if(isAlreadyAParticipant || isCurrentlyAddedAsParticipant) {
                return [...addedParticipants];
            }
            
            return [...addedParticipants, newParticipant];
        });
    }

    const removeParticipant = (participantId) => {
        setParticipants((addedParticipants) => {
            const updatedParticipants = addedParticipants.filter((participant) => participant._id !== participantId);
            return updatedParticipants;
        });
    }

    const handleClickAddParticipants = () => {
        setError("");
        if(participants.length === 0) {
            setError("You must select one participant.")
            return;
        }

        setIsAddingParticipants(true);
        const participantIds = participants.map((participant) => participant._id);

        chatService.addParticipants(chatId, participantIds)
                    .then((response) => {
                        setIsAddingParticipants(false);
                        handleCloseAddParticipantsDialog();
                    })
                    .catch((error) => {
                        setIsAddingParticipants(false);
                        setError(error.error);
                    });
    }

    return (
        <Dialog open={true} onClose={handleCloseAddParticipantsDialog} fullWidth={true} maxWidth='sm' >
            <DialogTitle>
                Add more participants
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    {
                        error && 
                        <Alert severity="error">{error}</Alert>
                    }
                    <FriendsSelect handleSelectFriend={addParticipant} />
                    <ParticipantsList participants={participants} removeParticipant={removeParticipant} />
                </Stack>
                {
                    isAddingParticipants && 
                    <CircularProgress sx={sxCircularProgress}/>
                }
                {
                    !isAddingParticipants &&
                    <DialogActions>
                        <Button onClick={handleCloseAddParticipantsDialog}>Cancel</Button>
                        <Button onClick={handleClickAddParticipants}>Add</Button>
                    </DialogActions>
                }
            </DialogContent>
        </Dialog>
    );
};

const sxCircularProgress = {
    float: "right"
};