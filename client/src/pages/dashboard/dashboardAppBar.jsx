import * as React from 'react';
import MuiAppBar from '@mui/material/AppBar';
import {styled, useTheme} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import {authenticationService} from  '../../services/authenticationService';
import AccountSettingsDialog from './accountSettingsDialog';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, drawerWidth }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  })
}));

export default function DashboardAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [accountSettingsDialogOpen, setAccountSettingsDialogOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const subscription = authenticationService.currentUser.subscribe(currentUser => {
      setUser(currentUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenAccountSettingsDialog = () => {
    setAccountSettingsDialogOpen(true);
  };

  const handleCloseAccountSettingsDialog = () => {
    setAccountSettingsDialogOpen(false);
  };

  const {socket, open, drawerWidth, handleDrawerOpen} = props;
  const handleClickSignOut = () => {
      authenticationService.signOut();
      socket.disconnect();
  };

  const theme = useTheme();
  return (
    <AppBar position="fixed" open={open} theme={theme} drawerWidth={drawerWidth}>
      <Toolbar variant="dense" sx={sxToolbar(open)}>
        <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={sxMenuIconButton(open)} >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={sxAppName}>
          Chatter
        </Typography>
        {
          props.children
        }
        <Box sx={sxToolbarBox} />
        <IconButton size="small" onClick={handleClickMenu}>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </IconButton>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
          PaperProps={sxMenuPaperProps}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleOpenAccountSettingsDialog}>
            <Avatar /> Account settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClickSignOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
      {accountSettingsDialogOpen && <AccountSettingsDialog handleCloseAccountSettingsDialog={handleCloseAccountSettingsDialog} />}
    </AppBar>
  )
}

const sxToolbar = (open) => ({
    ...(open && {
      '@media (max-width: 500px)': {
        visibility: "hidden"
      }
    })
});

const sxMenuIconButton = (open) => ({ 
  mr: 2, 
  ...(open && { 
    display: 'none' 
  }) 
});

const sxAppName = {
  mr: 2
};

const sxToolbarBox = { 
  flexGrow: 1 
};

const sxMenuPaperProps = {
  elevation: 0,
  sx: {
    width: "240px",
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    }
  }
};