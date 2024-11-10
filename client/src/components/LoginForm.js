import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const CustomTextField = ({ label, ...props }) => (
  <Field
    name={props.name}
    as={TextField}
    label={label}
    variant="outlined"
    margin="normal"
    fullWidth
    helperText={<ErrorMessage name={props.name} />}
    error={Boolean(props.touched && props.errors)}
    {...props}
  />
);

const LoginForm = ({ onSubmit }) => (
  <Formik
    initialValues={{ username: '', password: '' }}
    validationSchema={Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    })}
    onSubmit={onSubmit}
  >
    {({ handleSubmit, errors, touched, isSubmitting }) => (
      <Form onSubmit={handleSubmit}>
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
          <CustomTextField
            name="username"
            label="Username"
            type="text"
            helperText={<ErrorMessage name="username" />}
            error={Boolean(touched.username && errors.username)}
          />
          <CustomTextField
            name="password"
            label="Password"
            type="password"
            helperText={<ErrorMessage name="password" />}
            error={Boolean(touched.password && errors.password)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: '100%' }}
            disabled={isSubmitting}
          >
            Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account yet?{' '}
            <Button component={Link} to="/signup" variant="text">
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Form>
    )}
  </Formik>
);

export default LoginForm;
