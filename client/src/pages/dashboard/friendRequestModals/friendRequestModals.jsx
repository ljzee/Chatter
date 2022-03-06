import * as React from 'react';
import FriendRequestModal from './friendRequestModal';

export default function FriendRequestModals(props) {
  const [requests, setRequests] = React.useState([]);

  const onNewFriendRequest = (data) => {
    setRequests([...requests, data]);
  };

  React.useEffect(() => {
    const {socket} = props;
    
    socket.on("new-friend-request", onNewFriendRequest);
    return () => {
      socket.off("new-friend-request", onNewFriendRequest);
    }
  }, []);

  const removeRequest = (requestId) => {
    const remainingRequests = requests.filter((request) => (request._id !== requestId));
    setRequests(remainingRequests);
  }

  return (
    <React.Fragment>
      {
        requests.map((request, index) =>
          <FriendRequestModal 
            key={index} 
            request={request} 
            handleCloseModal={() => {
              removeRequest(request._id);
            }}
          />
        )
      }
    </React.Fragment>
  )
}
