import { AppBar, Toolbar, Typography } from '@mui/material';

export default function UnauthenticatedAppBar() {
    return (
     <AppBar position="static">
        <Toolbar variant="dense" sx={{minHeight: "50px"}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chatter
          </Typography>
        </Toolbar>
      </AppBar>
    );
}