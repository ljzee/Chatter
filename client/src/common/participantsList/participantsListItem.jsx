import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, IconButton, Avatar, Divider, Box } from '@mui/material';
import StatusBadge from '../statusBadge';
import { Clear as ClearIcon } from '@mui/icons-material';
import {getImageUrl} from '../../helpers/urlHelper';

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

export default function ParticipantsListItem(props) {
    const {participant, removeParticipant} = props;

    const theme = useTheme();

    return (
        <React.Fragment>
            <Box 
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 1
                }}
            >
                <StatusBadge 
                    status={participant.status}  
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                        marginRight: 2
                    }} 
                >
                    <Avatar src={getImageUrl(participant.profileImageFilename)} />
                </StatusBadge>
                <Box>
                    <Typography variant="body1" component="div">
                        {participant.username}
                    </Typography>
                    <Typography variant="subtitle2" component="div" sx={{
                        color: theme.palette.text.secondary
                    }}>
                        {getStatusText(participant.status)}
                    </Typography>
                </Box>
                <Box sx={{flexGrow: 1}}/>
                <IconButton onClick={() => {
                    removeParticipant(participant._id);
                }}>
                    <ClearIcon/>
                </IconButton>
            </Box>
            <Divider/>
        </React.Fragment>
    )
}