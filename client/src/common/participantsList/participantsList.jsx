import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ParticipantsListItem from './participantsListItem';

export default function ParticipantsList(props) {
    const {participants, removeParticipant} = props;

    return (
        <Box>
            <Typography variant="h6">
                Participants{participants.length > 0 && <Typography variant='subtitle'>({participants.length})</Typography>}:
            </Typography>
            {
                participants.length === 0 && 
                <Typography variant="body1" sx={{color: 'gray'}}>
                    No participants selected.
                </Typography>
            }
            {
                participants.length > 0 &&
                <Stack>
                    {
                        participants.map((participant) => (
                            <ParticipantsListItem key={participant.id} participant={participant} removeParticipant={removeParticipant} />
                        ))
                    }
                </Stack>
            }
        </Box>
    ); 
}