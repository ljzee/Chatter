import axios from 'axios';
import { axiosHelper } from './axiosHelper';

export const userService = {
  getUserFriends,
  updateUser,
  removeFriend
};

function getUserFriends(searchValue = null) {
    return axios.get(`${process.env.REACT_APP_API_URL}/friend`,
                       {
                          ...axiosHelper.getAuthenticatedConfigOptions(),
                          params: {
                              searchValue: searchValue
                          } 
                       })
                .then((response) => (response.data))
                .catch(error => {
                  if(!error.response) {
                      return Promise.reject({
                        error: "Error connecting to the server. Please try again later."
                      })
                  }
  
                  return Promise.reject(error.response.data);
                });
}

function removeFriend(friendId) {
  return axios.delete(`${process.env.REACT_APP_API_URL}/friend/${friendId}`, axiosHelper.getAuthenticatedConfigOptions());
}

function updateUser(username, password, profileImageFilename) {
    return axios.put(`${process.env.REACT_APP_API_URL}/user`,
                     {username, password, profileImageFilename},
                     axiosHelper.getAuthenticatedConfigOptions())
                .then((response) => (response.data))
                .catch(error => {
                  if(!error.response) {
                    return Promise.reject({
                      error: "Error connecting to the server. Please try again later."
                    })
                  }

                  return Promise.reject(error.response.data);
                });
}
