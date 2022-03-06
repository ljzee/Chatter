import * as React from 'react';
import FriendsListItem from './friendsListItem';
import { Stack, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { useRouteMatch }  from "react-router-dom"; 
import { userService } from  '../../../../services/userService';
import { sortBy } from 'lodash';

export default function FriendsList(props) {
    const [friends, setFriends] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const {path} = useRouteMatch();

    const getUserFriends = () => {
        userService.getUserFriends()
                    .then((response) => {
                        setIsLoading(false);
                        setFriends(response.friends);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        setErrorMessage(error.error);
                    });
    }

    const onUpdateFriendRequest = () => {
        getUserFriends();
    };

    const {socket} = props;
    React.useEffect(() => {
        getUserFriends();

        let pollFriendsStatusInterval = setInterval(() => {
            getUserFriends();
        }, 30000);

        socket.on("update-friend-request", onUpdateFriendRequest);

        return () => {
            clearInterval(pollFriendsStatusInterval);
            socket.off("update-friend-request", onUpdateFriendRequest);
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

    let friendsFiltered = friends.filter((friend) => {
        if(path == "/friends" || path == "/friends/online") {
            return (friend.status == "active" || friend.status == "idle");
        }
        
        return true;
    });

    friendsFiltered = sortBy(friendsFiltered, ['status', 'username']);

    return (
      <Stack>
          { 
            friendsFiltered.length > 0 &&
            friendsFiltered.map((friend) => {
                return <FriendsListItem key={friend._id} friend={friend} getUserFriends={getUserFriends}/>
            })
          }
          {
            friendsFiltered.length == 0 &&
            (
                <Box sx={sxBox}>
                    <Typography>No friends to show.</Typography>
                </Box>
            )  
          }
      </Stack>
    );
}

const sxBox = {
    padding: 2
};