import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    signIn,
    signUp,
    signOut,
    isSignedIn,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
    updateCurrentUser
};

function getAxiosConfigOptions() {
  return {
        headers: { 'Content-Type': 'application/json' },
  };
}

function signIn(username, password) {
  return axios.post(`${process.env.REACT_APP_API_URL}/authentication`,
                     {username, password},
                     getAxiosConfigOptions())
              .then(user => {
                localStorage.setItem('currentUser', JSON.stringify(user.data));
                currentUserSubject.next(user.data);
              })
              .catch(error => {
                if(!error.response) {
                    return Promise.reject({
                      error: "Error connecting to the server. Please try again later."
                    })
                }

                return Promise.reject(error.response.data);
              });
}

function signUp(username, password) {
  return axios.post(`${process.env.REACT_APP_API_URL}/registration`,
                     {username, password},
                     getAxiosConfigOptions())
              .then(user => {
                localStorage.setItem('currentUser', JSON.stringify(user.data));
                currentUserSubject.next(user.data);
              })
              .catch(error => {
                if(!error.response) {
                    return Promise.reject({
                      error: "Error connecting to the server. Please try again later."
                    })
                }

                return Promise.reject(error.response.data);
              });
}

function signOut() {
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}

function isSignedIn() {
  return currentUserSubject.value !== null;
}

function updateCurrentUser(updatedUser) {
  let currentUserValue = currentUserSubject.value;
  for(const property in updatedUser) {
    if(currentUserValue.hasOwnProperty(property)) {
      currentUserValue[property] = updatedUser[property];
    }
  }

  currentUserSubject.next(currentUserValue);
}