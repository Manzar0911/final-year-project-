import {  Text, StyleSheet} from 'react-native'
import React, { useState } from 'react';
import client from '../api/client';
import { isValidEmail, isValidObjField, updateError } from '../utils/methods';
import { useLogin } from '../context/LoginProvider';


import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import FormSubmitButton from '../components/FormSubmitButton';

const LoginScreen = ({}) => {

  const { setIsLoggedIn } = useLogin();

  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const { email, password } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };


  const isValidForm = () => {
    if (!isValidObjField(userInfo))
      return updateError('Required all fields!', setError);

    if (!isValidEmail(email)) return updateError('Invalid email!', setError);

    if (!password.trim() || password.length < 8)
      return updateError('Password is too short!', setError);
    return true;
  };

  
  
  const submitForm = async () => {
    if (isValidForm()) {
      try {
        const res = await client.post('/login', { ...userInfo });
        process.env.REFRESH_TOKEN = res.data.refresh_token;
        setUserInfo({ email: '', password: '' });
        setIsLoggedIn(true);
        
      } catch (error) {
        console.log(error);
      }
    }
  };


  return (
    <FormContainer>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
      <FormInput 
        value={email}
        onChangeText={value => handleOnChangeText(value, 'email')}
        label='Email'
        placeholder='example@email.com'
        autoCapitalize='none'
      />
      <FormInput
        value={password}
        onChangeText={value => handleOnChangeText(value, 'password')}
        label='Password'
        placeholder='********'
        autoCapitalize='none'
        secureTextEntry
      />
      <FormSubmitButton 
      onPress={submitForm} 
      title='Login' />
    </FormContainer>
  );
}


const styles = StyleSheet.create({})


export default LoginScreen