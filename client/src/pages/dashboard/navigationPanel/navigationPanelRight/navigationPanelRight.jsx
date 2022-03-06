import * as React from 'react';
import { List, ListItem, ListItemText, ListItemButton, Input, IconButton, Box, Container, InputAdornment } from '@mui/material';
import { Add as AddIcon, PeopleAlt as PeopleIcon, Search as SearchIcon } from '@mui/icons-material';
import { useHistory, useLocation } from "react-router-dom";
import './navigationPanelRight.css';
import { startsWith } from 'lodash';
import ChatsList from './chatsList';
import StartChatDialog from '../../../../common/startChatDialog';

export default function NavigationPanelRight(props) {
  const {socket} = props;
  const [findAChatValue, setFindAChatValue] = React.useState("");
  const [startChatDialogOpen, setStartChatDialogOpen] = React.useState(false);

  let history = useHistory();
  let location = useLocation();

  const handleClickFriends = () => {
    history.push("/friends");
  }

  const handleChangeFindAChatInput = (e) => {
    setFindAChatValue(e.target.value);
  }

  const handleOpenStartChatDialog = () => {
    setStartChatDialogOpen(true);
  };

  const handleCloseStartChatDialog = () => {
    setStartChatDialogOpen(false);
  };

  return (
    <Container sx={sxContainer} disableGutters>
      <Box sx={sxFindAChatInputBox}>
        <Input placeholder="Find a chat" 
          disableUnderline={true} 
          sx={sxFindAChatInput}
          inputProps={inputPropsFindAChatInput}
          value={findAChatValue}
          onChange={handleChangeFindAChatInput}
          startAdornment={<InputAdornment><SearchIcon/></InputAdornment>}
        />
      </Box>
      <List disablePadding>
        <ListItem disablePadding onClick={handleClickFriends}>
          <ListItemButton className="navigation-tab" selected={startsWith(location.pathname, '/friends')}>
            <PeopleIcon sx={sxPeopleIcon}/>
            <ListItemText primary="Friends" sx={sxFriendsListItemText}/>
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={sxChatsBox}>
        <span>Chats</span>
        <IconButton size="medium" onClick={handleOpenStartChatDialog}>
          <AddIcon />
        </IconButton>
        {startChatDialogOpen && <StartChatDialog handleCloseStartChatDialog={handleCloseStartChatDialog} />}
      </Box>
      <ChatsList socket={socket} findAChatValue={findAChatValue} />
    </Container>
  );
}

const sxContainer = {
  display: "inline-block",
  width: "75%",
  height: "100%",
  overflowY: "scroll",
  textAlign: "center"
};

const sxFindAChatInputBox = {
  backgroundColor: "#D8D8D8",
  padding: "5px",
  width: "85%",
  borderRadius: "5px",
  margin: "16px auto",
  display: "flex"
};

const sxFindAChatInput = {
  fontSize: "0.9rem"
};

const inputPropsFindAChatInput = {
  style: {
    padding: 0
  }
};

const sxChatsBox = {
  display: 'flex',
  justifyContent: "space-between",
  padding: "0 5px 0 16px",
  alignItems: "center"
};

const sxPeopleIcon = {
  marginRight: 1
};

const sxFriendsListItemText = {
  minWidth: "40px"
};