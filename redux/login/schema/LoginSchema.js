import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email must not be empty'),
  password: Yup.string()
    .required('Password must not be empty'),
});

export default loginSchema;
