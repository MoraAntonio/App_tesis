import React, { useState, useEffect} from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from '../database/firebase';
import auth from '@react-native-firebase/auth';


const user = firebase.auth().currentUser;

const calluser = () => {
  console.log(user.email)
}


const ChatScreen = ({navigation}) => {
  return (
    <View style={styles.center}>
      <Button style={styles.button} title='Editar usuario' onPress={calluser}/>

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

export default ChatScreen;