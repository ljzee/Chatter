import * as React from 'react';
import { Autocomplete, TextField, MenuItem, Avatar, Box, Typography } from '@mui/material';
import StatusBadge from './statusBadge';
import { debounce } from 'lodash';
import { userService } from '../services/userService';
import { useTheme } from '@mui/material/styles';
import { sortBy } from 'lodash';
import {getImageUrl} from '../helpers/urlHelper';

function getStatusText(status) {
    let statusText = "Unknown";

    switch(status) {
        case "active":
            statusText = "Active";
            break;
        case "idle":
            statusText = "Idle";
            break;
        case "offline":
            statusText = "Offline";
            break;
    }

    return statusText;
}

export default function FriendsSelect(props) {
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const [value, setValue] = React.useState(null);

    const getUserFriendsDebounced = React.useMemo(() => debounce((searchValue, resolve, reject) => {
        if(searchValue === '') {
            resolve({
                friends: []
            });
            return;
        }

        userService.getUserFriends(searchValue)
                   .then(resolve)
                   .catch(reject);
    }, 200), []);

    React.useEffect(() => {
        getUserFriendsDebounced(
            inputValue,
            (response) => {setOptions(response.friends)},
            (error) => {setOptions([])}
        );
    }, [inputValue]);

    const theme = useTheme();

    let sortedOptions = sortBy(options, ['status', 'username']);

    const {handleSelectFriend} = props;

    return (
        <Autocomplete
            fullWidth={true}
            filterOptions={(x) => x}
            options={sortedOptions}
            autoComplete
            value={value}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.username
            }
            onChange={(event, newValue) => {
                handleSelectFriend(newValue);
                setValue(null);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label="Add a participant"></TextField>
            )}
            renderOption={(props, option) => {
                return (
                    <MenuItem {...props} sx={{display: 'flex'}} key={option.id}>
                        <StatusBadge status={option.status}  
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    sx={{ marginRight: 2 }} >
                            <Avatar src={getImageUrl(option.profileImageFilename)} />
                        </StatusBadge>
                        <Box>
                            <Typography variant="body1" component="div">
                                {option.username}
                            </Typography>
                            <Typography variant="subtitle2" component="div" sx={{
                                color: theme.palette.text.secondary
                            }}>
                                {getStatusText(option.status)}
                            </Typography>
                        </Box>
                    </MenuItem>
                );
            }}
        >

        </Autocomplete>
    );
}