import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchStackNavigator,
         BookStackNavigator,
         UserPostStackNavigator, 
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
            } else if (rn === "Mis Reservaciones") {
                iconName = focused
                ? 'md-receipt'
                : 'md-receipt-outline'
            } else if (rn === "Mis Publicaciones") {
              iconName = focused
              ? 'calendar'
              : 'calendar-outline'
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
        <Tab.Screen name="Mis Reservaciones" component={BookStackNavigator} />
        <Tab.Screen name="Mis Publicaciones" component={UserPostStackNavigator} />
        <Tab.Screen name="Usuario" component={UserStackNavigator} />

  
      </Tab.Navigator>
    );
  
};

export default BottomTabNavigator;