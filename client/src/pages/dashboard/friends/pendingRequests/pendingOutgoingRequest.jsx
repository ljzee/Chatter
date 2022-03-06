import * as React from 'react';
import PendingRequestBase from './pendingRequestBase'
import { IconButton } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { friendRequestService } from '../../../../services/friendRequestService';

export default function PendingOutgoingRequest(props) {
  const {pendingRequest, removePendingRequest} = props;

  const handleDeleteOutgoingRequest = () => {
    friendRequestService.deletePendingRequest(pendingRequest._id)
                        .then(() => {
                          removePendingRequest(pendingRequest._id);
                        })
                        .catch((error) => {
                          alert(error.error);
                        });
  };

  const requestControls = (
    <React.Fragment>
      <IconButton onClick={handleDeleteOutgoingRequest}>
        <ClearIcon/>
      </IconButton>
    </React.Fragment>
  );

  return (
    <PendingRequestBase
      username={props.pendingRequest.receiver.username}
      profileImageFilename={props.pendingRequest.receiver.profileImageFilename}
      onlineStatus="Active"
      requestLabel="Outgoing friend request"
      requestControls={requestControls}
    />
  );
}
