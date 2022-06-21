import React from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput } from "react-native";
import firebase from "firebase/compat";



//completar esto
const FavScreen = ({navigation}) => {

    const user = firebase.auth().currentUser;
    const fcreacion = Date(user.createdAt);
if (user !== null) {
    
}

  return (
      <View style={styles.center} >
        <Text>{user.email}</Text>
        <Text>{user.displayName}</Text>
        <Text>Fecha de ingreso: {fcreacion}</Text>
     
      </View>

  
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default FavScreen;