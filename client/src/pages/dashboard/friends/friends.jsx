import * as React from 'react';
import FriendsList from './friendsList';
import AddFriend from './addFriend';
import PendingRequests from './pendingRequests';
import { Divider, Tab, Tabs, Box } from '@mui/material';
import { useRouteMatch, useLocation, Link, Switch, Route }  from "react-router-dom"; 

const Friends = (props) => {
  let {url, path} = useRouteMatch();
  let {pathname} = useLocation();

  const {socket} = props;

  return (
    <Box sx={sxBox}>
      <Tabs value={pathname == url ? `${url}/online` : pathname} >
        <Tab value={`${url}/online`} to={`${url}/online`} label="Online" component={Link} />
        <Tab value={`${url}/all`} to={`${url}/all`} label="All" component={Link} />
        <Tab value={`${url}/pending`} to={`${url}/pending`} label="Pending" component={Link} />
        <Tab value={`${url}/add`} to={`${url}/add`} label="Add" component={Link} />
      </Tabs>
      <Divider/>
      <Switch>
        <Route exact path={[url, `${url}/online`, `${url}/all`]} >
          <FriendsList socket={socket} />
        </Route>
        <Route path={`${url}/pending`} >
          <PendingRequests socket={socket} />
        </Route>
        <Route path={`${url}/add`} >
          <AddFriend/>
        </Route>
      </Switch>
    </Box>
  );
}

const sxBox = {
  padding: {
    sm: 2
  }
};

export default Friends;
