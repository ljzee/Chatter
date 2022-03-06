import { authenticationService } from './authenticationService';

export const axiosHelper = {
  getAuthenticatedConfigOptions
};

function getAuthenticatedHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}` };
    } else {
        return {};
    }
}

function getAuthenticatedConfigOptions(contentType = 'application/json') {
  return {
        headers: {
            'Content-Type': contentType,
            ...getAuthenticatedHeader()
        }
  };
}
