import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import UserChatBubble from './userChatBubble';
import OtherChatBubble from './otherChatBubble';
import { authenticationService } from '../../../../services/authenticationService';

export default function ChatBubbleContainer(props) {
    const {messages, hasMoreMessages, handleClickLoadMore, isLoadingMoreMessages} = props;

    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderMessage = (message, isFirst) => {
        if(message.sender._id === authenticationService.currentUserValue.userId) {
            return <UserChatBubble key={message._id} message={message} isFirst={isFirst} />
        }

        return <OtherChatBubble key={message._id} message={message} isFirst={isFirst} />
    };

    let currentUserId = null;

    return (
     <Box sx={sxBox(hasMoreMessages)} >
        {
            messages.length === 0 &&
            (
                <Box sx={sxNoMessagesBox}>
                    <Typography variant="body2" sx={sxNoMessagesTypography}>
                        There are currently no messages in this chat. Type the first message below.
                    </Typography>
                </Box>
            )
        }
        {
            hasMoreMessages && 
            <Button sx={sxLoadMoreMessagesButton} disabled={isLoadingMoreMessages} onClick={handleClickLoadMore}>
                Load More
            </Button> 
        }
        {
            messages.length > 0 && 
            messages.map(message => {
                let isFirst = false;
                if(currentUserId !== message.sender._id) {
                    isFirst = true;
                    currentUserId = message.sender._id;
                }

                return renderMessage(message, isFirst);
            })
        }
        <div ref={messagesEndRef} />
      </Box>
    );
};

const sxBox = (hasMoreMessages) => ({
    position: "sticky",
    top: "114px",
    height: "calc(100vh - 114px)",
    overflowY: "scroll",
    boxSizing: "border-box",
    paddingBottom: "100px",
    paddingTop: hasMoreMessages ? "0px" : "25px"
});

const sxNoMessagesBox = {
    textAlign: "center", 
    marginTop: "100px",
    padding: 2
};

const sxNoMessagesTypography = {
    color: "rgba(0, 0, 0, 0.6)"
};

const sxLoadMoreMessagesButton = {
    width: "100%"
};