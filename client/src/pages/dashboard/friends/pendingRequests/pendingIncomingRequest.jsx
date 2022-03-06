import * as React from 'react';
import PendingRequestBase from './pendingRequestBase'
import { IconButton } from '@mui/material';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import { friendRequestService } from '../../../../services/friendRequestService';

export default function PendingIncomingRequest(props) {
  const {pendingRequest, removePendingRequest} = props;

  const updateIncomingRequest = (acceptRequest) => {
    friendRequestService.updatePendingRequest(pendingRequest._id, acceptRequest)
                        .then(() => {
                          removePendingRequest(pendingRequest._id);
                        })
                        .catch((error) => {
                          alert(error.error);
                        });
  };

  const acceptIncomingRequest = () => {
    updateIncomingRequest(true);
  }

  const rejectIncomingRequest = () => {
    updateIncomingRequest(false);
  }

  const requestControls = (
    <React.Fragment>
      <IconButton onClick={acceptIncomingRequest} >
        <CheckIcon/>
      </IconButton>
      <IconButton onClick={rejectIncomingRequest}>
        <ClearIcon/>
      </IconButton>
    </React.Fragment>
  );

  return (
    <PendingRequestBase
      username={props.pendingRequest.sender.username}
      profileImageFilename={props.pendingRequest.sender.profileImageFilename}
      onlineStatus="Active"
      requestLabel="Incoming friend request"
      requestControls={requestControls}
    />
  );
}
