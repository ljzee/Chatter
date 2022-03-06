import * as React from 'react';
import { Box } from '@mui/material';

export default function ChatHeaderContainer(props) {
    const {children, ...rest} = props;

    return (
        <Box sx={sxBox}>
          {children && React.cloneElement(children, rest)}
        </Box>
    );
}

const sxBox = {
  position: "sticky",
  top: "50px",
  backgroundColor: "#E5E5E5",
  height: "64px",
  zIndex: 1000
};