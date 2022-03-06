import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import {userService} from '../../../../services/userService';

export default function RemoveFriendConfirmationDialog(props) {
    const {username, id, handleClose, getUserFriends} = props;

    const handleClickYes = () => {
        userService.removeFriend(id)
                   .then(() => {
                        getUserFriends();
                        handleClose();
                   })
                   .catch((error) => {
                        alert("Unable to remove friend. Please try again later.");
                   });
    }

    return (
        <Dialog open onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                Remove friend
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`Are you sure you want to remove '${username}' as a friend?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickYes} autoFocus>
                    Yes
                </Button>
                <Button onClick={handleClose}>No</Button>
            </DialogActions>
        </Dialog>
    );
}