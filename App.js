import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import BottomTabNavigator from "./navigation/TabNavigator";
import 'react-native-gesture-handler';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


 const App = () => {


  return (
    


    
    <NavigationContainer>
    <BottomTabNavigator />
    </NavigationContainer>
  
   
  );
}
export default App