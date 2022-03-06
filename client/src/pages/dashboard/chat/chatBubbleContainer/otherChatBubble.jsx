import * as React from 'react';
import { Box, Paper, Avatar, Typography } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import moment from 'moment';
import _ from 'lodash';
import {getImageUrl} from '../../../../helpers/urlHelper';

export default function OtherChatBubble(props) {
    const {message, isFirst} = props;
    
    return (
        <Box display="flex" alignItems="center" sx={sxBox}>   
            {
                isFirst &&
                <Avatar src={getImageUrl(message.sender.profileImageFilename)} sx={sxAvatar}>
                    <PersonIcon/>
                </Avatar>
            }
            <Paper elevation={1} sx={sxPaper(isFirst)}> 
                {
                  isFirst &&
                  <Box sx={sxUserInfoBox}>
                    <Typography variant="caption" sx={sxUsernameTypography}>
                        {message.sender.username}
                    </Typography>
                    <Typography variant="caption">
                        {moment(message.sentAt).format("YYYY-MM-DD h:mm:ss a")}
                    </Typography>
                  </Box>
                }
                <Typography variant="body2">
                    {message.contents}
                </Typography>
            </Paper>
        </Box>
    );
};

const sxBox = {
    textAlign: "left",
    marginBottom: "5px",
    marginLeft: "25px"
};

const sxAvatar = {
    marginRight: "10px"
};

const sxPaper = (isFirst) => ({
    display: "inline-block",
    padding: "5px 10px",
    fontSize: "0.8rem",
    marginLeft: isFirst ? 0 : "50px"
});

const sxUserInfoBox = {
    display: "flex", 
    color: "rgba(0, 0, 0, 0.4)"
};

const sxUsernameTypography = {
    marginRight: "5px"
};