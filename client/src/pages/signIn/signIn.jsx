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
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export default function SignIn({history}) {
  const [error, setError] = React.useState("");

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const {username, password} = values;
      authenticationService.signIn(username, password)
                           .then(() => {
                             history.push("/");
                           })
                           .catch((error) => {
                             setError(error.error);
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
        <CssBaseline />
        <Box sx={sxBox}>
          <Avatar sx={sxAvatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            <Button type="submit" fullWidth variant="contained" sx={sxSignInButton}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <MuiLink component={Link} to="/signin">
                  Forgot password?
                </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink component={Link} to="/signup">
                  Don't have an account? Sign Up
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

const sxSignInButton = { 
  mt: 3, 
  mb: 2 
};