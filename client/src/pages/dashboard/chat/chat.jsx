import * as React from 'react';
import { useParams } from 'react-router-dom';
import ChatHeaderLoading from './chatHeaderLoading';
import ChatHeaderLoaded from './chatHeaderLoaded';
import ChatBox from './chatBox';
import ChatBubbleContainer from './chatBubbleContainer';
import { chatService } from '../../../services/chatService';
import { keyBy } from 'lodash';
import { Box } from '@mui/material';

export default function Chat(props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [chatName, setChatName] = React.useState("");
  const [participants, setParticipants] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [messagesOffset, setMessagesOffset] = React.useState(0);
  const [hasMoreMessages, setHasMoreMessages] = React.useState(false);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = React.useState(false);

  const clearState = () => {
    setIsLoading(true);
    setChatName("");
    setParticipants([]);
    setMessages([]);
    setMessagesOffset(0);
    setHasMoreMessages(false);
    setIsLoadingMoreMessages(false);
  }

  const {id} = useParams();

  const {socket} = props;

  const onNewMessage = (message) => {
    if(message.chat._id !== id) {
      return;
    }

    setMessages(messages => [...messages, message]);
  } 

  const onUserLeaveChat = (data) => {
    if(data.chatId !== id) {
      return;
    }

    setParticipants(prevParticipants => {
      const updatedParticipants = prevParticipants.filter((participant) => participant._id !== data.userId);
      return updatedParticipants;
    });
  }

  const onAddParticipants = (data) => {
    chatService.getParticipants(id)
               .then(response => {
                  setParticipants(response.participants);
               })
               .catch(error => {})
  }

  const getParticipantsStatus = () => {
    chatService.getParticipantsStatus(id)
               .then(response => {
                  const participantIdToParticipantStatus = keyBy(response.participantsStatus, "participantId");
                  setParticipants(previousParticipants => {
                    const updatedParticipants = previousParticipants.map(participant => {
                      let status = "offline";
                      if(participantIdToParticipantStatus[participant._id]) {
                        status = participantIdToParticipantStatus[participant._id].status;
                      }

                      return {
                        ...participant,
                        status: status
                      }
                    });
                    
                    return updatedParticipants;
                  });
               })
               .catch(error => {})
  }

  const handleClickLoadMore = () => {
    setIsLoadingMoreMessages(true);
    chatService.getMessages(id, messagesOffset)
               .then((response) => {
                  setIsLoadingMoreMessages(false);
                  setMessages(prevMessages => [...response.messages ,...prevMessages]);
                  setHasMoreMessages(response.hasMoreMessages);
                  setMessagesOffset(prevOffset  => (prevOffset + response.messages.length));
               })
               .catch((error) => {
                  setIsLoadingMoreMessages(false);
                  alert(error.error);
               });  
  }

  React.useEffect(() => {
    clearState();

    chatService.getChat(id)
               .then(chat => {
                 let chatName = chat.chatName;
                 if(!chatName) {
                     const participantUsernames = chat.participants.map(participant => participant.username);
                     chatName = participantUsernames.join(", ");
                 }
                 setChatName(chatName);
                 setParticipants(chat.participants);
                 setMessages(chat.messages);
                 setMessagesOffset(chat.messages.length);
                 setHasMoreMessages(chat.hasMoreMessages);
                 setIsLoading(false);
               })
               .catch(error => {
                 alert(error.error);
               });

      const pollParticipantStatusInterval = setInterval(() => {
        getParticipantsStatus();
      }, 30000);

      socket.on("new-message", onNewMessage);
      socket.on("leave-chat", onUserLeaveChat);
      socket.on("add-participants", onAddParticipants);

      return () => {
        clearInterval(pollParticipantStatusInterval);

        socket.off("new-message", onNewMessage);
        socket.off("leave-chat", onUserLeaveChat);
        socket.off("add-participants", onAddParticipants);
      }
  }, [id]);

  if(isLoading) {
    return (
      <ChatHeaderLoading />
    );
  }

  return (
    <Box>
      <ChatHeaderLoaded chatId={id} chatName={chatName} participants={participants} />
      <ChatBubbleContainer messages={messages} hasMoreMessages={hasMoreMessages} handleClickLoadMore={handleClickLoadMore} isLoadingMoreMessages={isLoadingMoreMessages}/>
      <ChatBox />
    </Box>
  );
}
