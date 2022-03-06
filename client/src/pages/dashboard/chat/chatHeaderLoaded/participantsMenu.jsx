import * as React from 'react';
import { Divider, Menu, MenuItem, Avatar } from '@mui/material';
import StatusBadge from '../../../../common/statusBadge';
import {getImageUrl} from '../../../../helpers/urlHelper';

export default function ParticipantsMenu(props) {
    const {participants, participantsMenuAnchorEl, participantsMenuOpen, handleCloseParticipantsMenu} = props;

    return (
        <Menu
            anchorEl={participantsMenuAnchorEl}
            open={participantsMenuOpen}
            onClose={handleCloseParticipantsMenu}
            PaperProps={sxMenuPaperProps}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >  
            {
                participants.map((participant, index) => (
                    <div key={index}>
                        <MenuItem>
                            <StatusBadge 
                                status={participant.status}  
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                sx={sxStatusBadge} 
                            >
                                <Avatar src={getImageUrl(participant.profileImageFilename)} />
                            </StatusBadge>
                            {participant.username}
                        </MenuItem>
                        {index < participants.length - 1 && <Divider/>}
                    </div>
                ))
            }
        </Menu>
    );
};

const sxMenuPaperProps = {
    elevation: 0,
    sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
        },
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
        }
    }
};

const sxStatusBadge = {
    marginRight: 2
};