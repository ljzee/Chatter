import axios from 'axios';
import { axiosHelper } from './axiosHelper';

export const chatService = {
    createChat,
    getUserChats,
    getChat,
    getMessages,
    sendMessage,
    getParticipantsStatus,
    leaveChat,
    getParticipants,
    addParticipants
};

function createChat(participants, chatName) {
    return axios.post(`${process.env.REACT_APP_API_URL}/chat`,
                       {participants, chatName},
                       axiosHelper.getAuthenticatedConfigOptions())
                .then((response) => (response.data))
                .catch(error => {
                  if(!error.response) {
                      return Promise.reject({
                        error: "Error connecting to the server. Please try again later."
                      });
                  }
  
                  return Promise.reject(error.response.data);
                });
}

function getUserChats() {
    return axios.get(`${process.env.REACT_APP_API_URL}/chat`,
                     axiosHelper.getAuthenticatedConfigOptions())
                .then((response) => (response.data))
                .catch(error => {
                  if(!error.response) {
                      return Promise.reject({
                        error: "Error connecting to the server. Please try again later."
                      });
                  }
  
                  return Promise.reject({
                      error: "An error occured while trying to retrieve your chats. Please try again later."
                  });
                });
}

function getChat(chatId) {
    return axios.get(`${process.env.REACT_APP_API_URL}/chat/${chatId}`,
                     axiosHelper.getAuthenticatedConfigOptions())
                .then(response => response.data)
                .catch(error => {
                    if(!error.response) {
                        return Promise.reject({
                            error: "Error connecting to the server. Please try again later."
                        });
                    }

                    if(error.response.status === 403) {
                        return Promise.reject({
                            error: "You are not part of this chat."
                        });
                    }

                    return Promise.reject({
                        error: "An error occured while trying to retrieve your chat. Please try again later."
                    });
                });
}

function getMessages(chatId, offset) {
    const getChatMessagesConfigs = {
        ...axiosHelper.getAuthenticatedConfigOptions(),
        params: {
            offset: offset
        }
    }

    return axios.get(`${process.env.REACT_APP_API_URL}/chat/${chatId}/messages`,
                     getChatMessagesConfigs)
                .then(response => response.data)
                .catch(error => {
                    if(!error.response) {
                        return Promise.reject({
                            error: "Error connecting to the server. Please try again later."
                        });
                    }

                    if(error.response.status === 403) {
                        return Promise.reject({
                            error: "You are not part of this chat."
                        });
                    }

                    return Promise.reject({
                        error: "An error occured while trying to retrieve your chat messages. Please try again later."
                    });
                });
}

function sendMessage(chatId, message) {
    return axios.post(`${process.env.REACT_APP_API_URL}/chat/${chatId}/message`,
                      {message},
                      axiosHelper.getAuthenticatedConfigOptions())
                .then(response => response.data)
                .catch(error => {
                    if(!error.response) {
                        return Promise.reject({
                            error: "Error connecting to the server. Please try again later."
                        });
                    }

                    return Promise.reject({
                        error: "An error occured while trying to send your message. Please try again later."
                    });
                });
}

function getParticipantsStatus(chatId) {
    return axios.get(`${process.env.REACT_APP_API_URL}/chat/${chatId}/participants/status`,
                     axiosHelper.getAuthenticatedConfigOptions())
                .then(response => response.data)
                .catch(error => Promise.reject());
}

function leaveChat(chatId) {
    return axios.delete(`${process.env.REACT_APP_API_URL}/chat/${chatId}`, axiosHelper.getAuthenticatedConfigOptions());
}

function getParticipants(chatId) {
    return axios.get(`${process.env.REACT_APP_API_URL}/chat/${chatId}/participants`,
                    axiosHelper.getAuthenticatedConfigOptions())
                .then(response => response.data)
                .catch(error => Promise.reject()); 
}

function addParticipants(chatId, participantIds) {
    return axios.post(`${process.env.REACT_APP_API_URL}/chat/${chatId}/participants`,
                      {participantIds},
                      axiosHelper.getAuthenticatedConfigOptions())
                .then(response => Promise.resolve())
                .catch(error => {
                    if(!error.response) {
                        return Promise.reject({
                            error: "Error connecting to the server. Please try again later."
                        });
                    }

                    return Promise.reject(error.response.data);
                });
}