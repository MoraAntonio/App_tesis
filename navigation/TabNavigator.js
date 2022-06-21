import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchStackNavigator,
         FavStackNavigator,
         ChatStackNavigator,
         UserStackNavigator} from "./StackNavigator";
        import firebase from "firebase/compat";

const user = firebase.auth().currentUser;


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

    return (

      <Tab.Navigator
      
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard:"true",
      
        tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name;
  
            if (rn === "Buscar") {
                iconName = focused
                ? 'search'
                : 'search'
            } else if (rn === "Favoritos") {
                iconName = focused
                ? 'heart'
                : 'heart-outline'
            } else if (rn === "Chat") {
                iconName = focused
                ? 'chatbox'
                : 'chatbox-outline'
            } else if (rn === "Usuario") {
                iconName = focused
                ? 'person'
                : 'person-outline'
            }
            
            return <Ionicons name={iconName} size={size} color={color}/>
        },
        tabBarActiveTintColor: "#44abdf",
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {paddingBottom: 8, fontSize: 11,},
        tabBarStyle: {padding: 10, 
                      height: 60, 
                      backgroundColor: '#dddddd',
                      },
    })}
      >
        <Tab.Screen name="Buscar" component={SearchStackNavigator} />
        <Tab.Screen name="Usuario" component={UserStackNavigator} />
  
      </Tab.Navigator>
    );
  
};

export default BottomTabNavigator;