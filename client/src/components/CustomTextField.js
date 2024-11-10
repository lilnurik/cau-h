import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { TextField } from '@mui/material';

const CustomTextField = ({ label, ...props }) => (
  <Field name={props.name}>
    {({ field, form }) => (
      <TextField
        {...field}
        label={label}
        variant="outlined"
        margin="normal"
        fullWidth
        helperText={<ErrorMessage name={props.name} component="div" style={{ color: 'red' }} />}
        error={Boolean(form.errors[props.name] && form.touched[props.name])}
        {...props}
      />
    )}
  </Field>
);

export default CustomTextField;
