import * as React from 'react';
import { friendRequestService } from  '../../../../services/friendRequestService';
import { Box, Typography, CircularProgress, Alert, Table, TableContainer, TableBody, TableRow, TableCell } from '@mui/material';
import PendingIncomingRequest from './pendingIncomingRequest';
import PendingOutgoingRequest from './pendingOutgoingRequest';

export default function PendingRequests(props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [pendingRequests, setPendingRequests] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const removePendingRequest = (requestIdToRemove) => {
    const updatedPendingRequests = pendingRequests.filter((pendingRequest) => pendingRequest._id !== requestIdToRemove);
    setPendingRequests(updatedPendingRequests);
  };

  const getPendingRequests = () => {
    friendRequestService.getPendingRequests()
    .then((response) => {
      setIsLoading(false);
      setPendingRequests(response.requests);
    })
    .catch((error) => {
      setIsLoading(false);
      setErrorMessage(error.error);
    });
  }

  const onUpdateFriendRequest = (data) => {
    removePendingRequest(data.id);
  }

  const onNewFriendRequest = () => {
    getPendingRequests();
  }

  const {socket} = props;

  React.useEffect(() => {
    getPendingRequests();
    
    socket.on("update-friend-request", onUpdateFriendRequest);
    socket.on("new-friend-request", onNewFriendRequest);
    return () => {
      socket.off("update-friend-request", onUpdateFriendRequest);
      socket.off("new-friend-request", onNewFriendRequest);
    }
  }, []);

  if(isLoading) {
    return (
      <Box sx={sxBox}>
        <CircularProgress />
      </Box>
    );
  }

  if(errorMessage) {
    return (
      <Box sx={sxBox}>
        <Alert severity="error">
          {errorMessage}
        </Alert>
      </Box>
    );
  }

  const hasPendingRequests = pendingRequests.length > 0;

  return (
      <TableContainer>
        <Table>
          <TableBody>
            {
              !hasPendingRequests &&
              <TableRow>
                <TableCell sx={sxBox}>
                  <Typography variant="body1" component="div">
                    No pending friend requests.
                  </Typography>
                </TableCell>
              </TableRow>
            }
            {
              hasPendingRequests &&
              pendingRequests.map((pendingRequest) => {
                return pendingRequest.isOutgoingRequest ?
                        (<PendingOutgoingRequest key={pendingRequest._id} pendingRequest={pendingRequest} removePendingRequest={removePendingRequest}/>) :
                        (<PendingIncomingRequest key={pendingRequest._id} pendingRequest={pendingRequest} removePendingRequest={removePendingRequest}/>);
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    );
}

const sxBox = {
  padding: 2
};