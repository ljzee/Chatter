import * as React from 'react';
import NavigationPanel from './navigationPanel';
import Chat from './chat';
import Friends from './friends';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Redirect, Switch } from 'react-router-dom';
import FriendRequestModals from './friendRequestModals';
import { authenticationService } from  '../../services/authenticationService';
import { io } from "socket.io-client";
import UnauthenticatedAppBar from '../../common/unauthenticatedAppBar';
import { throttle } from 'lodash';
import DashboardAppBar from './dashboardAppBar';
import DashboardContentContainer from './dashboardContentContainer';

const drawerWidth = 300; // extract into constants file or other ways instead of passing down to child components as props

export default function Dashboard(props) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [socket, setSocket] = React.useState(null);
  
  React.useEffect(() => {
    const currentUser = authenticationService.currentUserValue;
    const socket = io(process.env.REACT_APP_API_URL, {
        auth: {
          token: currentUser.token
        }
    });
    setSocket(socket);

    const handleUserActivity = () => {
      socket.emit("user-activity");
    }
    const handleUserActivityThrottled = throttle(handleUserActivity, 30000);
    const domEventsToTrack = ["keydown", "scroll", "mousemove", "mousedown"];
    domEventsToTrack.forEach((event) => {
      window.addEventListener(event, handleUserActivityThrottled);
    });

    return () => {
      socket.disconnect();

      domEventsToTrack.forEach((event) => {
        window.removeEventListener(event, handleUserActivityThrottled);
      });
    }
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  if(socket == null) {
    return <UnauthenticatedAppBar/>
  }

  return (
    <Box sx={sxDashboardBox}>
      <CssBaseline />
      <NavigationPanel 
        open={drawerOpen}
        drawerWidth={drawerWidth}
        socket={socket}
        handleDrawerClose={handleDrawerClose} 
      />
      <DashboardAppBar 
        open={drawerOpen}
        drawerWidth={drawerWidth} 
        socket={socket}
        handleDrawerOpen={handleDrawerOpen}
      />
      <DashboardContentContainer open={drawerOpen} drawerWidth={drawerWidth}>
        <Switch>
          <Route path="/friends">
            <Friends socket={socket} />
          </Route>
          <Route path="/chats/:id">
            <Chat socket={socket} />
          </Route>
          <Route>
            <Redirect to="/friends" />
          </Route>
        </Switch>
      </DashboardContentContainer>
      <FriendRequestModals socket={socket} />
    </Box>
  );
}

const sxDashboardBox = { 
  display: 'flex', 
  height: "100vh", 
  overflow: "hidden" 
};