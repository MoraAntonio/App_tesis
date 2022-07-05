import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import 'react-native-gesture-handler';
import { UserProvider } from "./context/userContext";
import BottomTabNavigator from "./navigation/TabNavigator";

 const App = () => {
//expo build:android -t apk

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