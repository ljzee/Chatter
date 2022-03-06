import axios from 'axios';
import { axiosHelper } from './axiosHelper';

export const friendRequestService = {
  sendRequest,
  getPendingRequests,
  deletePendingRequest,
  updatePendingRequest
};

function sendRequest(username) {
  return axios.post(`${process.env.REACT_APP_API_URL}/friendRequest`,
                     {username},
                     axiosHelper.getAuthenticatedConfigOptions())
              .catch(error => {
                if(!error.response) {
                    return Promise.reject({
                      error: "Error connecting to the server. Please try again later."
                    })
                }

                return Promise.reject(error.response.data);
              });
}

function getPendingRequests() {
  return axios.get(`${process.env.REACT_APP_API_URL}/friendRequest`,
                   axiosHelper.getAuthenticatedConfigOptions())
              .then((response) => (response.data))
              .catch(error => {
                if(!error.response) {
                    return Promise.reject({
                      error: "Error connecting to the server. Please try again later."
                    })
                }

                return Promise.reject({
                  error: "An error occured while trying to retrieve your pending friend requests. Please try again later."
                });
              });
}

function deletePendingRequest(requestId) {
  return axios.delete(`${process.env.REACT_APP_API_URL}/friendRequest/${requestId}`,
                   axiosHelper.getAuthenticatedConfigOptions())
              .catch(error => {
                if(!error.response) {
                    return Promise.reject({
                      error: "Error connecting to the server. Please try again later."
                    })
                }

                return Promise.reject({
                  error: "An error occured while trying to delete your pending friend request. Please try again later."
                });
              });
}

function updatePendingRequest(requestId, acceptRequest) {
  return axios.put(`${process.env.REACT_APP_API_URL}/friendRequest/${requestId}`,
                   {acceptRequest},
                   axiosHelper.getAuthenticatedConfigOptions())
              .catch(error => {
                if(!error.response) {
                    return Promise.reject({
                      error: "Error connecting to the server. Please try again later."
                    })
                }

                return Promise.reject({
                  error: "An error occured while trying to update your pending friend request. Please try again later."
                });
              });
}
