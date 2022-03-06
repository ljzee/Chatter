import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {authenticationService} from  '../services/authenticationService';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            return <Redirect to="/signin" />
        }

        return <Component {...props} />
    }} />
)
