export const signIn = async (userInfo) => {
    try {
        const res = await client.post('/login', { ...userInfo });
        process.env.REFRESH_TOKEN = res.data.refresh_token;
        setUserInfo({ email: '', password: '' });
        setIsLoggedIn(true);
        // if (res.status === 200) {
        //   }
        return res;
    } catch (error) {
        console.log('error inside signin method.',error.message);
    }

}

// export const signOut = async () => {
//     try {
//         const refresh_token = process.env.REFRESH_TOKEN;
//         const res = await client.post('/logout',refresh_token,{
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${refresh_token}`,
//         })
//         if(res.status === 200){
//             console.log('logout');
//             process.env.REFRESH_TOKEN = '';
//         }

//     } catch (error) {
//         console.log('error inside signout method.', error.message);
//     }
// }