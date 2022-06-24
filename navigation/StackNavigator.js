import React from "react";
import { createStackNavigator } from "@react-navigation/stack";


//Rama de publicaciones
import SearchHome from "../screens/SearchHome";
import PostDetails from "../screens/postDetails";
import CreatePostScreen from "../screens/createPost";
import CheckInScreen from "../screens/CheckInScreen";
import UpdatePostScreen from "../screens/UpdatePost";
import GetMap from "../screens/Getmap";
import CheckIn2 from "../screens/CheckIn2";

//Rama del usuario
import SignUpScreen from "../screens/SignUpScreen";
import LoginScreen from "../screens/LoginScreen";
import UserDetails from "../screens/userDetails";
import UpdateUserScreen from "../screens/UpdateUserScreen";
import WhiteSpace from "../screens/UserWhiteSpace";

//Rama de reservaciones
import BookIndex from "../screens/BookIndex";

//Rama de publicaciones del usuario actual
import UserPosts from "../screens/userPosts";

import { getAuth } from "firebase/auth";




const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#44abdf",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const SearchStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} 
    >
      <Stack.Screen name="Explorar" component={SearchHome} />
      <Stack.Screen name="Detalles" component={PostDetails} />
      <Stack.Screen name="Crear Publicacion" component={CreatePostScreen} />
      <Stack.Screen name="Reservar" component={CheckInScreen} />
      <Stack.Screen name="Editar" component={UpdatePostScreen} />
      <Stack.Screen name="Crear Ubicacion" component={GetMap} />
      <Stack.Screen name="Confirmar pago" component={CheckIn2} />
      
    </Stack.Navigator>
  );
}


const BookStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Mis Reservaciones" component={BookIndex} />
    </Stack.Navigator>
  );
}

const UserPostStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Mis Publicaciones" component={UserPosts} />
      <Stack.Screen name="Detalles" component={PostDetails} />
      <Stack.Screen name="Editar" component={UpdatePostScreen} />
    </Stack.Navigator>
  );
}

const UserStackNavigator = () => {

    return (
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="WhiteSpace"  component={WhiteSpace}/>
        <Stack.Screen name="UserDetails" component={UserDetails}/>
        <Stack.Screen name="UpdateUser"  component={UpdateUserScreen} />
        <Stack.Screen name="Login"       component={LoginScreen} />
        <Stack.Screen name="SignUp"      component={SignUpScreen} />
        
        
      </Stack.Navigator>
    )

}

export { SearchStackNavigator, BookStackNavigator,
         UserPostStackNavigator, UserStackNavigator };