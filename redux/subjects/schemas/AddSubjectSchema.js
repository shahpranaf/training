import * as Yup from 'yup';

export const addSubjectSchema = Yup.object().shape({
  title: Yup.string()
    .required('Required'),
});

export default addSubjectSchema;
