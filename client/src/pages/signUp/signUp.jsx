import * as React from 'react';
import { Avatar, Button, CssBaseline, TextField, Link as MuiLink, Grid, Box, Typography, Container, Alert } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { authenticationService } from  '../../services/authenticationService';
import { Redirect } from 'react-router-dom';
import UnauthenticatedAppBar from '../../common/unauthenticatedAppBar';

const theme = createTheme();

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

export default function SignUp({history}) {
  const [error, setError] = React.useState("");

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values, {setFieldError}) => {
      const {username, password} = values;

      authenticationService.signUp(username, password)
                           .then(() => {
                             history.push("/");
                           })
                           .catch((error) => {
                             setError(error.error);
                             if(error.subErrors) {
                               error.subErrors.map(({field, error}) => {
                                 setFieldError(field, error);
                               });
                             }
                           });
    }
  });

  if(authenticationService.isSignedIn()) {
    return (
      <Redirect to="/"/>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <UnauthenticatedAppBar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={sxBox}>
          <Avatar sx={sxAvatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          {
            error && 
            <Alert severity="error" variant="outlined" sx={sxAlert}>
              {error}
            </Alert>
          }
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={sxFormBox}>
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
            <Button type="submit" fullWidth variant="contained" sx={sxSignUpButton}>
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <MuiLink component={Link} to="/signin">
                  Already have an account? Sign In
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

const sxBox = {
  marginTop: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 8
};

const sxAvatar = {
  m: 1, 
  bgcolor: 'secondary.main' 
};

const sxAlert = {
  marginTop: 3
};

const sxFormBox = {
  mt: 1
};

const sxSignUpButton = {
  mt: 3, 
  mb: 2
};