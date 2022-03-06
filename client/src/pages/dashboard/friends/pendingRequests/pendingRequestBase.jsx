import * as React from 'react';
import { Box, Avatar, Typography, TableRow, TableCell } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {getImageUrl} from '../../../../helpers/urlHelper';

export default function PendingRequestBase(props) {
  const theme = useTheme();
  
  return (
    <TableRow>
      <TableCell sx={sxUserTableCell}>
        <Box sx={sxUserTableCellAvatarBox}>
          <Avatar src={getImageUrl(props.profileImageFilename)}>
            <PersonIcon/>
          </Avatar>
        </Box>
        <Box sx={sxUserTableCellInfoBox}>
          <Typography variant="body1" component="div">
            {props.username}
          </Typography>
          <Typography variant="subtitle2" component="div" sx={sxStatusTypography(theme)} >
            {props.onlineStatus}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={sxRequestInfoTableCell}>
        <Typography variant="subtitle2" component="div" sx={sxRequestTypography(theme)}>
          {props.requestLabel}
        </Typography>
      </TableCell>
      <TableCell sx={sxRequestControlsTableCell}>
        {props.requestControls}
      </TableCell>
    </TableRow>
  );
}

const sxUserTableCell = {
  width: "25%"
};

const sxUserTableCellAvatarBox = {
  marginRight: 2,
  display: "inline-block",
  verticalAlign: "middle"
};

const sxUserTableCellInfoBox = {
  display: "inline-block",
  verticalAlign: "middle"
};

const sxStatusTypography = (theme) => ({
  color: theme.palette.text.secondary
});

const sxRequestInfoTableCell = {
  width: "55%"
};

const sxRequestTypography = (theme) => ({
  color: theme.palette.text.secondary
});

const sxRequestControlsTableCell = {
  width: "20%", 
  textAlign: "right"
};