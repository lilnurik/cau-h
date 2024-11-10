import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Typography } from '@mui/material';
import CustomTextField from './CustomTextField'; 
import CustomSelect from './CustomSelect'; 
import { Link } from 'react-router-dom';

const dietOptions = [
  "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal"
];
const intoleranceOptions = [
  "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
];
const cuisineOptions = [
  "African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", "French",
  "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean",
  "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
];

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username is too short')
    .max(25, 'Username is too long')
    .required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password is too short')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
    .required('Password is required'),
  diet: Yup.array().of(Yup.string()),
  intolerance: Yup.array().of(Yup.string()),
  cuisine: Yup.array().of(Yup.string())
});

const SignupForm = ({ onSubmit }) => (
  <Formik
    initialValues={{
      username: '',
      email: '',
      password: '',
      diet: [],
      intolerance: [],
      cuisine: []
    }}
    validationSchema={SignupSchema}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    }}
  >
    {({ handleSubmit, isSubmitting, setFieldValue }) => (
      <Form onSubmit={handleSubmit}>
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
          <CustomTextField
            name="username"
            label="Username"
            type="text"
          />
          <CustomTextField
            name="email"
            label="Email"
            type="email"
          />
          <CustomTextField
            name="password"
            label="Password"
            type="password"
          />
          <CustomSelect
            name="diet"
            label="Diet (optional)"
            options={dietOptions}
            onChange={(value) => setFieldValue("diet", value)}
          />
          <CustomSelect
            name="intolerance"
            label="Intolerances (optional)"
            options={intoleranceOptions}
            onChange={(value) => setFieldValue("intolerance", value)}
          />
          <CustomSelect
            name="cuisine"
            label="Cuisine (optional)"
            options={cuisineOptions}
            onChange={(value) => setFieldValue("cuisine", value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: '100%' }}
            disabled={isSubmitting}
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Button component={Link} to="/login" variant="text">
              Login
            </Button>
          </Typography>
        </Box>
      </Form>
    )}
  </Formik>
);

export default SignupForm;

















// import React from 'react';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import { Box, Button, Typography } from '@mui/material';
// import CustomTextField from './CustomTextField'; 
// import CustomSelect from './CustomSelect'; 
// import { Link } from 'react-router-dom';


// const dietOptions = [
//   "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal"
// ];
// const intoleranceOptions = [
//   "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
// ];
// const cuisineOptions = [
//   "African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", "French",
//   "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean",
//   "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
// ];

// const SignupSchema = Yup.object().shape({
//   username: Yup.string()
//     .min(3, 'Username is too short')
//     .max(25, 'Username is too long')
//     .required('Username is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   password: Yup.string()
//     .min(8, 'Password is too short')
//     .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//     .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//     .matches(/[0-9]/, 'Password must contain at least one number')
//     .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
//     .required('Password is required'),
//   diet: Yup.array().of(Yup.string()),
//   intolerance: Yup.array().of(Yup.string()),
//   cuisine: Yup.array().of(Yup.string())
// });

// const SignupForm = ({ onSubmit }) => (
//   <Formik
//     initialValues={{
//       username: '',
//       email: '',
//       password: '',
//       diet: [],
//       intolerance: [],
//       cuisine: []
//     }}
//     validationSchema={SignupSchema}
//     onSubmit={(values, { setSubmitting }) => {
//       onSubmit(values);
//       setSubmitting(false);
//     }}
//   >
//     {({ handleSubmit, isSubmitting }) => (
//       <Form onSubmit={handleSubmit}>
//         <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
//           <CustomTextField
//             name="username"
//             label="Username"
//             type="text"
//           />
//           <CustomTextField
//             name="email"
//             label="Email"
//             type="email"
//           />
//           <CustomTextField
//             name="password"
//             label="Password"
//             type="password"
//           />
//           <CustomSelect
//             name="diet"
//             label="Diet (optional)"
//             options={dietOptions}
//           />
//           <CustomSelect
//             name="intolerance"
//             label="Intolerances (optional)"
//             options={intoleranceOptions}
//           />
//           <CustomSelect
//             name="cuisine"
//             label="Cuisine (optional)"
//             options={cuisineOptions}
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             sx={{ mt: 2, width: '100%' }}
//             disabled={isSubmitting}
//           >
//             Sign Up
//           </Button>
//           <Typography variant="body2" align="center" sx={{ mt: 2 }}>
//             Already have an account?{' '}
//             <Button component={Link} to="/login" variant="text">
//               Login
//             </Button>
//           </Typography>
//         </Box>
//       </Form>
//     )}
//   </Formik>
// );

// export default SignupForm;
