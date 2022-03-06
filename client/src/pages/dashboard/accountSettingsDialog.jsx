import * as React from 'react';
import { styled } from '@mui/material/styles';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, Grid, Box, Avatar, TextField, Alert, CircularProgress} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {userService} from '../../services/userService';
import {authenticationService} from '../../services/authenticationService';
import {uploadService} from '../../services/uploadService';
import {getImageUrl} from '../../helpers/urlHelper';

const FileInput = styled('input')({
  display: 'none'
});

const validationSchema = yup.object({
    username: yup
      .string()
      .required('Username is required')
      .min(8, 'Username must have minimum eight characters'),
    password: yup
      .string()
      .required('Password is required')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number'}),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export default function AccountSettingsDialog(props) {
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const currentUser = authenticationService.currentUserValue;

  const formik = useFormik({
    initialValues: {
        username: currentUser.username,
        password: '',
        confirmPassword: '',
        profileImageFilename: currentUser.profileImageFilename
    },
    validationSchema: validationSchema,
    onSubmit: (values, {setFieldError}) => {
        setSaving(true);

        const {username, password, profileImageFilename} = values;

        userService.updateUser(username, password, profileImageFilename)
                   .then(() => {
                        setSaving(false);
                        setError("");
                        setSuccess("Your changes have been saved successfully.");
                        authenticationService.updateCurrentUser({username, profileImageFilename});
                   })
                   .catch((error) => {
                        setSaving(false);
                        setSuccess("");
                        setError(error.error);
                        if(error.subErrors) {
                            error.subErrors.map(({field, error}) => {
                                setFieldError(field, error);
                            });
                        }
                   });
    }
  });

  const {handleCloseAccountSettingsDialog} = props;

  const handleFileChanged = (e) => {
    uploadService.uploadImage(e.target.files[0])
                 .then(response => {
                   formik.setFieldValue('profileImageFilename', response.data.filename);
                 })
                 .catch(error => {
                   setError(error.response.data.error);
                 });
    e.target.value = null;
  }

  const handleClickRemove = () => {
    formik.setFieldValue('profileImageFilename', '');
  }

  return (
    <Dialog
      open
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth={"md"}
    >
      <DialogTitle id="alert-dialog-title">
        Account Settings
      </DialogTitle>
      <Divider/>
      <DialogContent>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {success.length > 0 && <Alert severity="success">{success}</Alert>}
                {error.length > 0 && <Alert severity="error">{error}</Alert>}
            </Grid>
            <Grid item xs={12} md={4}>
                <Box sx={sxProfileImageBox}>
                    <Avatar sx={sxAvatar} src={getImageUrl(formik.values.profileImageFilename)} />
                    <label htmlFor="change-profile-image-button">
                      <FileInput accept="image/*" id="change-profile-image-button" multiple type="file" onChange={handleFileChanged}/> 
                      <Button variant="outlined" component="span">Change</Button>
                    </label>
                    {formik.values.profileImageFilename.length > 0 && 
                     <Button variant="outlined" color="error" sx={sxRemoveButton} onClick={handleClickRemove}>Remove</Button>}
                </Box>
            </Grid>
            <Grid item xs={12} md={8}>
                <Box>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        sx={sxUsernameTextfield}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                </Box>
            </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={sxDialogActions}>
        {!saving && <Button onClick={formik.handleSubmit}>Save Changes</Button>}
        {saving && <CircularProgress/>}
        <Button onClick={handleCloseAccountSettingsDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

const sxProfileImageBox = {
  textAlign: "center"
};

const sxAvatar = {
  margin: "0 auto 20px",
  height: "150px",
  width: "150px"
};

const sxRemoveButton = {
  marginLeft: "5px"
};

const sxUsernameTextfield = {
  marginTop: 0
};

const sxDialogActions = {
  padding: 2
};