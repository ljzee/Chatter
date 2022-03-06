import * as React from 'react';
import List from '@mui/material/List';
import ChatListItem from './chatsListItem';
import { chatService } from '../../../../../services/chatService';
import { orderBy } from 'lodash';
import { useHistory, useLocation } from "react-router-dom";

export default function ChatsList(props) {
    const [chats, setChats] = React.useState([]);

    const {socket, findAChatValue} = props;

    const getUserChats = () => {
        chatService.getUserChats()
                   .then(response => {
                       const chatsOrdered = orderBy(response.chats, ({latestSentAt}) => latestSentAt || new Date(-8640000000000000).toISOString()
                       , ["desc"]);
                       setChats(chatsOrdered);
                   })
                   .catch(error => {});
    }

    const onCreateNewChat = (data) => {
        setChats(prevChats => [data, ...prevChats]);
    }

    const onNewMessage = (data) => {
        setChats(prevChats => {
            const messageChat = data.chat;
            const chatsWithoutMessageChat = prevChats.filter((chat) => chat._id !== messageChat._id);
            return [data.chat, ...chatsWithoutMessageChat];
        });
    }

    const onUserLeaveChat = (data) => {
        setChats(prevChats => {
            const chatIndex = prevChats.findIndex((chat) => chat._id === data.chatId);
            const chat = prevChats[chatIndex];
            const chatParticipants = chat.participants;
            const chatParticipantsWithoutUserLeft = chatParticipants.filter((participant) => participant._id !== data.userId);
            const chatUpdated = {
                ...chat,
                participants: chatParticipantsWithoutUserLeft
            }
            const chatsUpdated = prevChats.slice();
            chatsUpdated[chatIndex] = chatUpdated;
            return chatsUpdated;
        });
    }

    React.useEffect(() => {
        getUserChats();

        socket.on("create-new-chat", onCreateNewChat);
        socket.on("new-message", onNewMessage);
        socket.on("leave-chat", onUserLeaveChat);
        return () => {
          socket.off("create-new-chat", onCreateNewChat);
          socket.off("new-message", onNewMessage);
          socket.off("leave-chat", onUserLeaveChat);
        }
    }, []);

    let chatsFiltered = chats;
    if(findAChatValue) {
        chatsFiltered = chats.filter((chat) => {
            if(!chat.chatName) {
                return false;
            }

            return chat.chatName.toLowerCase().includes(findAChatValue.toLowerCase());
        });
    }

    let history = useHistory();
    const removeChat = (chatId) => {
        let firstChatId = null;

        setChats(prevChats => {
            const chatsWithoutRemovedChat = prevChats.filter((chat) => chat._id !== chatId);

            if(chatsWithoutRemovedChat.length > 0) {
                firstChatId = chatsWithoutRemovedChat[0]._id;
            }

            return chatsWithoutRemovedChat;
        });

        if(firstChatId) {
            history.push(`/chats/${firstChatId}`);
        } else {
            history.push('/friends');
        }
    }

    return (
      <List disablePadding>
          {
              chatsFiltered.map((chat) => (<ChatListItem key={chat._id} chat={chat} removeChat={removeChat}/>))
          }
      </List>
    );
}