import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import React from 'react';
import {Button, Card, Paragraph} from 'react-native-paper';
import {useLogin} from '../context/LoginProvider';

const AccountScreen = () => {
  const {profile, setIsLoggedIn} = useLogin();

  console.log(profile.userProducts);

  const openDial = phone => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${phone}`);
    } else {
      Linking.openURL(`telprompt:${phone}`);
    }
  };
  const logOut = () => {
    process.env.REFRESH_TOKEN = '';
    setIsLoggedIn(false);
  };

  const renderItem = item => {
    return (
      <Card style={styles.card}>
        <Card.Title title={item.title} />
        <Card.Content>
          <Paragraph>{item.desc}</Paragraph>
          <Paragraph>{item.age} Years</Paragraph>
        </Card.Content>
        <Card.Cover source={{uri: item.image}} />
        <Card.Actions>
          <Button>{item.price}</Button>
          <Button onPress={() => openDial()}>Call Seller</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View>
      <View
        style={{
          height: '50%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 22}}>
        {/* {profile.accoutDetails.name} */}
        </Text>
        <Text style={{fontSize: 18}}>
        {/* {profile.accoutDetails.email} */}
        </Text>
        <Button
          mode="contained"
          onPress={async () => {
            // const isLoggedOut = await signOut()
            logOut();
            // if(isLoggedOut){

            // }
          }}>
          Logout
        </Button>
        <Text style={{fontSize: 22}}>Your ads!</Text>
      </View>
      <View>
        <FlatList
          data={profile.userProducts}
          keyExtractor={item => item.phone}
          renderItem={({item}) => renderItem(item)}
          // onRefresh={() => getDetails()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    elevation: 2,
  },
});

export default AccountScreen;
