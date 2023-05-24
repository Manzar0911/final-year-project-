import { View, Text, FlatList, StyleSheet, Platform, Linking } from 'react-native';
import React from 'react';
import {  Button, Card, Paragraph } from 'react-native-paper';
import { useState } from 'react';
import { useEffect } from 'react';
import client from '../api/client';

const ListItemScreen = () => {

    const [dataList,setDataList] = useState([]);

    const openDial = (phone) => {
        if(Platform.OS === 'android'){
            Linking.openURL(`tel:${phone}`);
        }else{
            Linking.openURL(`telprompt:${phone}`);
        }
    }

    useEffect(()=>{

        const fetchData = async () => {
            
            const res = await client.get('/products');
            
            setDataList(res.data);
        }

        fetchData();

    },[]);

    const renderItem = (item) => {
        return (
            <Card style={styles.card}>
                <Card.Title title={item.title} />
                <Card.Content>
                    <Paragraph>{item.desc}</Paragraph>
                    <Paragraph>{item.age} Years</Paragraph>
                </Card.Content>
                <Card.Cover source={{ uri: item.image }} />
                <Card.Actions>
                    <Button>{item.price}</Button>
                    <Button onPress={() => openDial()}>Call Seller</Button>
                </Card.Actions>
            </Card> 
        )
    }

  return (
    <View>
      <FlatList 
        data={dataList}
        keyExtractor={(item) => item.phone}
        renderItem={({item}) => renderItem(item)}
        
      />
    </View>
  )
}

const styles= StyleSheet.create({
    card: {
        margin: 10,
        elevation: 2,

    }
})

export default ListItemScreen