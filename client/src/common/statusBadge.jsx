
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

const StatusBadge = styled(Badge, {
    shouldForwardProp: (prop) => prop !== "status"
})(({ status, theme }) => {
    let color = theme.palette.grey[400];
    switch(status) {
        case "active":
            color = theme.palette.success.light;
            break;
        case "idle":
            color = theme.palette.warning.light;
            break;
    }

    let styles =  {
        '& .MuiBadge-badge': {
            backgroundColor: color,
            color: color,
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '1px solid currentColor',
                content: '""',
            }
        }
    }

    if(status === "active") {
        styles['& .MuiBadge-badge']['&::after']['animation'] = 'ripple 1.2s infinite ease-in-out';
        styles['@keyframes ripple'] = {
            '0%': {
              transform: 'scale(.8)',
              opacity: 1,
            },
            '100%': {
              transform: 'scale(2.4)',
              opacity: 0,
            },
          };
    }

    return styles;
});

export default StatusBadge;