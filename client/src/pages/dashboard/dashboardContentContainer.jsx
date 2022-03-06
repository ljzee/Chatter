import * as React from 'react';
import { styled } from '@mui/material/styles';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, drawerWidth }) => ({
    flexGrow: 1,
    marginTop: "48px",
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0
    }),
  }),
);

export default function dashboardContentContainer(props) {
  const {children, ...rest} = props;

  return (
    <Main open={rest.open} drawerWidth={rest.drawerWidth}>
      {
        children && React.Children.map(children, (child) => React.cloneElement(child, rest))
      }
    </Main>
  );
}
