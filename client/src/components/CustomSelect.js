import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, useTheme } from '@mui/material';
import { Field, ErrorMessage } from 'formik';

const CustomSelect = ({ label, name, options }) => {
  const theme = useTheme();

  return (
    <FormControl fullWidth margin="normal" sx={{ minWidth: 200 }}>
      <InputLabel id={`${name}-label`}>
        {label}
      </InputLabel>
      <Field name={name}>
        {({ field, form }) => (
          <Select
            multiple
            labelId={`${name}-label`}
            id={name}
            label={label}
            value={field.value || []}  // Ensure it's always an array
            onChange={(event) => form.setFieldValue(name, event.target.value)}
            renderValue={(selected) => {
              if (!Array.isArray(selected)) {
                return '';
              }
              return selected.join(', ');
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 500,
                },
              },
            }}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={field.value.includes(option)} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        )}
      </Field>
      <ErrorMessage name={name} component="div" style={{ color: 'red' }} />
    </FormControl>
  );
};

export default CustomSelect;
