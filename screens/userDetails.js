import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import {auth} from '@react-native-firebase/auth';
import firebase from "firebase/compat";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";



export default function UserDetails ({route, navigation}) {

  const [user, setUser] = useState('');

  const getUser = () => {
    
    const auth = getAuth();
    const cuser = auth.currentUser;
    setUser(cuser);
  }


  const calluser = () => {
    navigation.navigate('UpdateUser');
    console.log(user)
  }

  const signOutUser = async () => {
    try {
       firebase.auth().signOut();
       navigation.navigate('Login');  
    } catch (e) {
        console.log(e);
    }
  }
  useEffect(() => {
    getUser();
  }, []);


  return (
    <ScrollView style={styles.container}>

    <View>
      <Text style ={styles.userTitle}> Ha ingresado como</Text>
      <Text style ={styles.userTitle2}>{user.displayName}</Text>
    </View>

    <TouchableOpacity style={styles.button1} onPress={calluser}>
      <Text style={styles.buttontxt}>Editar usuario</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button2} onPress={signOutUser}>
      <Text style={styles.buttontxt}>Cerrar sesion</Text>
    </TouchableOpacity>
    <View></View>

    </ScrollView>

  
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5cc3ff',
    flex: 1,
  },
  userTitle: {
    fontSize: 30,
    marginTop: '5%',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  userTitle2: {
    fontSize: 30,
    marginTop: '3%',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  button1: {
    marginTop: 20,
    backgroundColor: 'white',
    width: '58%',
    height: '15%',
    marginHorizontal: '21%',
    paddingTop: '5%',
    borderRadius: 10,
  },
  button2: {
    marginTop: 20,
    backgroundColor: 'white',
    width: '58%',
    height: '15%',
    marginHorizontal: '21%',
    paddingTop: '5%',
    borderRadius: 10,
    marginBottom: '50%'
  },
  buttontxt: {
    fontSize: 17,
    color: '#5cc3ff',
    textAlign: 'center',
    fontWeight: '900',
  }
});
