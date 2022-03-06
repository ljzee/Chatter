import * as React from 'react';
import { Box, Input } from '@mui/material';
import { chatService } from '../../../services/chatService';
import { useParams } from 'react-router-dom';

export default function ChatBox(props) {
    const [message, setMessage] = React.useState('');

    const handleChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    const {id} = useParams();

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
          const trimmedMessage = message.trim();
          if(trimmedMessage === '') {
              return;
          }

          chatService.sendMessage(id, message);
          setMessage('');
        }
    };

    return (
        <Box sx={sxBox}>
            <Input 
                placeholder="Type a new message" 
                sx={sxInput}
                value={message}
                onChange={handleChangeMessage}
                onKeyPress={handleKeyPress}
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