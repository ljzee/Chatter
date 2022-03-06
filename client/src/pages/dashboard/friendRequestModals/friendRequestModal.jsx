import * as React from 'react';
import { Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { friendRequestService } from  '../../../services/friendRequestService';

export default function FriendRequestModal(props) {
  const [message, setMessage] = React.useState(null);

  const {request, handleCloseModal} = props;

  const acceptFriendRequest = (accept) => {
    setMessage(null);
    friendRequestService.updatePendingRequest(request.id, accept)
                        .then(() => {
                          handleCloseModal();
                        })
                        .catch((error) => {
                          setMessage(error.error);
                        });
  };

  const handleClickAcceptFriendRequest = () => {
    acceptFriendRequest(true);
  };

  const handleClickDeclineFriendRequest = () => {
    acceptFriendRequest(false);
  };

  return (
    <Dialog open={true} onClose={handleCloseModal} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        New Friend Request
      </DialogTitle>
      <DialogContent>
        {
          message &&
          <Alert severity="error" sx={sxAlert}>{message}</Alert>
        }
        <DialogContentText id="alert-dialog-description">
          {`You have received a friend request from '${request.senderUsername}'. Do you want to accept this request?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickAcceptFriendRequest}>Accept</Button>
        <Button onClick={handleClickDeclineFriendRequest}>Decline</Button>
      </DialogActions>
    </Dialog>
  );
}

const sxAlert = {
  mb: 2
};