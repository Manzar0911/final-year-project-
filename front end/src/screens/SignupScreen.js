import { StyleSheet } from 'react-native'
import React, { useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import FormSubmitButton from '../components/FormSubmitButton';
import client from '../api/client';
import { useLogin } from '../context/LoginProvider';




import { Formik } from 'formik';
import * as Yup from 'yup';
import { signIn } from '../api/user';


const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, 'Invalid name!')
    .required('Name is required!'),
  email: Yup.string().email('Invalid email!').required('Email is required!'),
  password: Yup.string()
    .trim()
    .min(8, 'Password is too short!')
    .required('Password is required!'),
  repeat_Password: Yup.string().equals(
    [Yup.ref('password'), null],
    'Password does not match!'
  ),
});


const SignupScreen = ({}) => {

  const { setIsLoggedIn, setProfile } = useLogin();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });


  

  const signUp = async (values, formikActions) => {
    console.log('4');
    const res = await client.post('/register', {
      ...values, 
    });

    console.log('3');
    if (res.status === 200) {
      console.log('1');
      // setUserInfo({
      //   email: values.email,
      //   password: values.password,
      // })
      const signInRes = await client.post('/login', {
        email: values.email,
        password: values.password,
      });
      // const signInRes = await signIn(userInfo);
      if(signInRes.status === 200){
          console.log('2');
          setUserInfo({ email: '', password: '' });
          // setProfile(res.data.user);
          setIsLoggedIn(true);
      }
    }

    formikActions.resetForm();
    formikActions.setSubmitting(false);
  };





  return (

    <FormContainer>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={signUp}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          const { name, email, password, repeat_password } = values;
          return (
            <>
              <FormInput
                value={name}
                error={touched.name && errors.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                label='Name'
                placeholder='John Smith'
              />
              <FormInput
                value={email}
                error={touched.email && errors.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize='none'
                label='Email'
                placeholder='example@email.com'
              />
              <FormInput
                value={password}
                error={touched.password && errors.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                autoCapitalize='none'
                secureTextEntry
                label='Password'
                placeholder='********'
              />
              <FormInput
                value={repeat_password}
                error={touched.repeat_password && errors.repeat_password}
                onChangeText={handleChange('repeat_password')}
                onBlur={handleBlur('repeat_password')}
                autoCapitalize='none'
                secureTextEntry
                label='repeat_password'
                placeholder='********'
              />
              <FormSubmitButton
                submitting={isSubmitting}
                onPress={handleSubmit}
                title='Sign up'
              />
            </>
          );
        }}
      </Formik>
    </FormContainer>






  )
}


const styles = StyleSheet.create({})


export default SignupScreen