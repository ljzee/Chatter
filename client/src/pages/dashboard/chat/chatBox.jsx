import * as React from 'react';
import { Box, Input, InputAdornment, IconButton } from '@mui/material';
import { chatService } from '../../../services/chatService';
import { useParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

export default function ChatBox(props) {
    const [message, setMessage] = React.useState('');

    const handleChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    const {id} = useParams();

    const sendMessage = () => {
        const trimmedMessage = message.trim();
        if(trimmedMessage === '') {
            return;
        }

        chatService.sendMessage(id, message);
        setMessage('');
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleClickSend = () => {
        sendMessage();
    }

    return (
        <Box sx={sxBox}>
            <Input 
                placeholder="Type a new message" 
                sx={sxInput}
                value={message}
                onChange={handleChangeMessage}
                onKeyPress={handleKeyPress}
                endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="send message"
                        onClick={handleClickSend}
                      >
                        <SendIcon/>
                      </IconButton>
                    </InputAdornment>
                }
            />
        </Box>
    );
};

const sxBox = {
    position: "sticky",
    bottom: "40px",
    boxSizing: "border-box",
    padding: "10px",
    margin: "0 25px",
    backgroundColor: "white",
    borderRadius: "5px"
};

const sxInput = {
    width: "100%"
};