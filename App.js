import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import BottomTabNavigator from "./navigation/TabNavigator";
import 'react-native-gesture-handler';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import StripeApp from "./screens/StripeApp";
import { StripeProvider } from "@stripe/stripe-react-native";
import { UserProvider } from "./context/userContext";

 const App = () => {


  return (

    <StripeProvider
    publishableKey={
      "pk_test_51LEDRKDwNZZEyNd2KAypoPBKoApVUzhClPcPzP9W0Jt4WNLL0Csz8xIpTkO6GvqCXYKOzTIaF4bvahnj7hoqDGUw001tZ3oXiv"
    }
    merchantIdentifier="merchant.identifier"
    >
    <UserProvider>

          
    <NavigationContainer>
     <BottomTabNavigator />
     </NavigationContainer>
    

    </UserProvider>


    </StripeProvider>

  );
}
export default App