import React, {createContext, useContext, useEffect, useState} from 'react';
import client from '../api/client';
const LoginContext = createContext();

const LoginProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});

  const getAccesToken = async () => {
    // console.log('hi aashish')
    console.log(process.env.REFRESH_TOKEN)
    const udata = {
      refresh_token: process.env.REFRESH_TOKEN,
    };
    console.log(udata)
    const data = await client.post('/refresh', udata, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log('hi ishu')
    return await data;
  };

  // const fetchUser = async () => {
  //   const token = await AsyncStorage.getItem('token');
  //   if(token !== null){
  //     const res = await client.get('/me', {
  //       headers:{
  //         Authorization: `Bearer ${token}`
  //       }
  //     })

  //     if(res.data.success){
  //       setProfile(res.data.profile);
  //       setIsLoggedIn(true);
  //     } else{
  //       setProfile({});
  //       setIsLoggedIn(false);
  //     }
  //   }else{
  //     setProfile({});
  //     setIsLoggedIn(false);
  //   }
  // }

  // const getAccesToken = async () => {
  //   // console.log(process.env.REFRESH_TOKEN);
  //   const udata = {
  //     refresh_token: process.env.REFRESH_TOKEN,
  //   };
  //   console.log(udata);
  //   const data = await client.post('/refresh',udata, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     // data: JSON.stringify(udata),
  //   });
  //   console.log(data.json());
  //   return await data.json();
  // };

  const fetchUser = async () => {
    // console.log('hi sanat')
    const data = await getAccesToken();
    console.log(data);
    // const token = process.env.REFRESH_TOKEN;
    // console.log('hi manzar')
    const userData = await client.get('/me', {
      headers: {
        Authorization: `Bearer ${data.data.access_token}`,
      },
    });
    // if(userData.status === 200){
    //   setProfile(userData.data);
    //   setIsLoggedIn(true);
    // }
    // else{
    //   setProfile({});
    //   setIsLoggedIn(false);
    // }
    // if (token !== null) {
    // }
    // else{
    //   setProfile({});
    //   setIsLoggedIn(false);
    // }

    setProfile(userData.data);

  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <LoginContext.Provider
      value={{isLoggedIn, setIsLoggedIn, profile, setProfile}}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
