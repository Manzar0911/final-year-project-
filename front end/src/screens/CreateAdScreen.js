import { View, Text, StyleSheet } from 'react-native';
import React,{useState} from 'react';
import { TextInput, Button } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import * as ImagePicker from 'expo-image-picker';
import client from '../api/client';


const CreateAdScreen = () => {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [age, setAge] = useState('');
    const [price, setPrice] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState('');

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

    // const [userInfo, setUserInfo] = useState({
    //     name: '',
    //     desc: '',
    //     age: '',
    //     price: '',
    //     phone: '',
    //     image: '',
    //   });
    
    //   const { name,desc, age, price, phone, image } = userInfo;
    
    //   const handleOnChangeText = (value, fieldName) => {
    //     setUserInfo({ ...userInfo, [fieldName]: value });
    //   };


      const submitForm = async () => {
        const data = await getAccesToken();
        const res = await client.post('/products', 
        // { ...userInfo }
        {
            name: name,
            desc: desc,
            age: age,
            price: price,
            phone: phone,
            image: image,
        },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `JWT ${data.data.access_token}`,
            },
        }
        );
        console.log(res.config.data);

      };

      const openCamera = () => {
        launchCamera({quality:0.8}, (fileobj) => {
            console.log(fileobj.assets[0].fileName);
            // handleOnChangeText(fileobj.assets[0].fileName,image);
            setImage(fileobj.assets[0].fileName);
            // console.log(userInfo);
        })
        // launchImageLibrary({},(fileobj)=>{
        //     console.log(fileobj);
        // })
      };





  return (
    <View style={styles.container}>
        <Text style={styles.text}>Create Ad!</Text>
        <TextInput 
            label="Ad title"
            value={name}
            mode="outlined"
            onChangeText={value => setName(value)}
        />
        <TextInput 
            label="Describe what you are selling"
            value={desc}
            mode="outlined"
            numberOfLines={3}
            multiline={true}
            onChangeText={value => setDesc(value)}
        />
        <TextInput 
            label="Age"
            value={age}
            mode="outlined"
            keyboardType='numeric'
            onChangeText={value => setAge(value)}
        />
        <TextInput 
            label="Price"
            value={price}
            mode="outlined"
            keyboardType='numeric'
            onChangeText={value => setPrice(value)}
        />
        <TextInput 
            label="Contact No."
            value={phone}
            mode="outlined"
            keyboardType='numeric'
            onChangeText={value => setPhone(value)}
        />
        <Button icon="camera" mode='contained' onPress={() => openCamera()}>
            Upload Image
        </Button>
        <Button disabled={image?false:true} mode='contained' onPress={() => submitForm()}>
            Post
        </Button>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal:30,
        justifyContent: "space-evenly"
    },
    text: {
        fontSize: 22,
        textAlign: "center",
    }
})

export default CreateAdScreen