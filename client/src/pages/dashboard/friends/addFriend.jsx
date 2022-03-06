import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useFormik } from 'formik';
import { friendRequestService } from  '../../../services/friendRequestService';
import * as yup from 'yup';

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
});

export default function AddFriend(props) {
  const [isSendingRequest, setIsSendingRequest] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const [sendRequestSuccess, setSendRequestSuccess] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const {username} = values;

      setIsSendingRequest(true);
      setMessage(null);

      friendRequestService.sendRequest(username)
                           .then(() => {
                             setIsSendingRequest(false);
                             setSendRequestSuccess(true);
                             setMessage("Your request has been sent.");
                           })
                           .catch((error) => {
                             setIsSendingRequest(false);
                             setSendRequestSuccess(false);
                             setMessage(error.error);
                           });
    }
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={sxBox}>
      {
        message &&
        <Alert severity={sendRequestSuccess ? "success" : "error"} sx={sxAlert}>
          {message}
        </Alert>
      }
      <TextField
        id="outlined-basic"
        label="Enter your friend's username"
        variant="outlined"
        fullWidth
        id="username"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        sx={sxUsernameTextField}/>
        <Box sx={sxAddButtonBox}>
          <Button variant="contained" disabled={isSendingRequest} type="submit" sx={sxAddButton}>Add</Button>
          {isSendingRequest && <CircularProgress/>}
        </Box>
    </Box>
  );
}

const sxBox = {
  padding: 2
};

const sxAlert = {
  mb: 2
};

const sxUsernameTextField = {
  width: "100%",
  marginBottom: 2
};

const sxAddButtonBox = {
  display: "flex", 
  alignItems: "center"
};

const sxAddButton = {
  mr: 1
};