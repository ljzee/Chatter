import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import moment from 'moment';

export default function UserChatBubble(props) {
    const {message, isFirst} = props;

    return (
        <Box sx={sxBox}>
            <Paper elevation={1} sx={sxPaper}> 
                {
                  isFirst &&
                  <Typography variant="caption" sx={sxTimestampTypography}>
                    {moment(message.sentAt).format("YYYY-MM-DD h:mm:ss a")}
                  </Typography>
                }
                <Typography variant="body2">
                  {message.contents}
                </Typography>
            </Paper>
        </Box>
    );
};

const sxBox = {
  textAlign: "right",
  marginRight: "25px"
};

const sxPaper = {
  display: "inline-block",
  padding: "5px 10px",
  fontSize: "0.8rem",
  marginBottom: "5px",
  backgroundColor: "#e3f2fd"
};

const sxTimestampTypography = {
  color: "rgba(0, 0, 0, 0.4)"
};