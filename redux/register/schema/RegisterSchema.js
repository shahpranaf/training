import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  roleName: Yup.string()
    .required('Select Role'),
});

export default registerSchema;
