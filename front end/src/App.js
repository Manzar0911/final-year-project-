
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 

import CreateAdScreen from './screens/CreateAdScreen';
import HomeScreen from './screens/ListItemScreen';
import AccountScreen from './screens/AccountScreen';
import LoginProvider, { useLogin } from './context/LoginProvider';



import Feather from 'react-native-vector-icons/Feather';
import AppForm from './screens/AppForm';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'deepskyblue',
  },
};

// const Stack = createNativeStackNavigator();

// const StackNavigator = () => {
//   return (
//     <Stack.Navigator>
//         <Stack.Screen 
//           name="Auth"
//           component={AppForm}
//         />
//         <Stack.Screen 
//           name="Home"
//           component={TabNavigator}
//         />
//        </Stack.Navigator>
//   );
// }


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if(route.name === 'Home'){
            iconName = 'home';
          }
          else if(route.name === 'create'){
            iconName = 'plus-circle';
          }
          else{
            iconName = 'user';
          }

          return  <View>
            <Feather name={iconName} size={35} color={color} />
          </View>
        },
      })}
      tabBarOptions={{
        activeTintColor: 'deepskyblue',
        inactiveTintColor: 'gray',
      }} 
    >
      <Tab.Screen name='Home' component={HomeScreen} options={{title: ""}} />
      <Tab.Screen name='create' component={CreateAdScreen} options={{title: ""}} />
      <Tab.Screen name='account' component={AccountScreen} options={{title: ""}} />
    </Tab.Navigator>
  )
}


const MainNavigator = () => {
  const { isLoggedIn } = useLogin();
  return isLoggedIn?<TabNavigator/>:<AppForm/>;
}

const Navigation = () => {
  // const { isLoggedIn } = useLogin();
  return (
     <LoginProvider>
      <NavigationContainer>
         <MainNavigator/>
      </NavigationContainer>
     </LoginProvider> 
)};

const App = () => {

  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="lightgrey"/>
        <View style={styles.container}>
          <Navigation />
        </View> 
      </PaperProvider>     
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    
  }
});

export default App;
