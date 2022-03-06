import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {styled} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NavigationPanelLeft from './navigationPanelLeft';
import NavigationPanelRight from './navigationPanelRight';

const DrawerHeader = styled(AppBar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  padding: theme.spacing(0, 1),
  justifyContent: 'flex-end',
  width: "inherit",
  left: 0,
  clipPath: "inset(-10px 0px -10px -10px)",
  minHeight: "50px"
}));

export default function NavigationPanel(props) {
  const {drawerWidth, open, socket, handleDrawerClose} = props;

  return (
    <Drawer sx={sxDrawer(drawerWidth)} variant="persistent" anchor="left" open={open}>
      <DrawerHeader onClick={handleDrawerClose}>
        <Toolbar variant="dense">
          <IconButton>
            <ChevronLeftIcon sx={sxChevronLeftIcon}/>
          </IconButton>
        </Toolbar>
      </DrawerHeader>
      <Box sx={sxBox}>
        <NavigationPanelLeft/>
        <NavigationPanelRight socket={socket} />
      </Box>
    </Drawer>
  );
}

const sxDrawer = (drawerWidth) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: 'inherit',
    borderStyle: "none",
    backgroundColor: "#E5E5E5"
  }
});

const sxChevronLeftIcon = {
  color: "#fff"
};

const sxBox = {
  flexGrow: 1,
  marginTop: "50px",
  overflow: "hidden"
};