import React, {useEffect} from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import {NavigationContainer, useNavigation } from '@react-navigation/native';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig, app} from '../database/firebase';
import firebase from 'firebase/compat';



  export default function LoginScreen({route, navigation}) {

    //estados
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [currentUser, setCurrentUser] = React.useState('')
    const auth = getAuth(app);
    const user = auth.currentUser;

    //ir a pantalla de registro de usuario
    const goToSignup = () => {
      navigation.navigate('SignUp');
    }

    //Funcion de login

    const handleSignIn = () => {
      signInWithEmailAndPassword(auth, email, password)
      .then((currentUser) => {
        console.log('Signed in!')
        setCurrentUser(firebase.auth().currentUser);
        navigation.navigate('UserDetails');
      })
      .catch(error => {
        alert(error)
      })
    }


  

    return (
      <View style={styles.container}>
       <ScrollView style={styles.scroll}> 
            <View style={styles.login}>
              
                <Text style={{fontSize: 17, fontWeight: '400', color: 'black'}}>E-mail</Text>
                <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder="ejemplo@ejemplo.com" />
              
                <Text style={{fontSize: 17, fontWeight: '400', color: 'black'}}>Clave</Text>
                <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder="Clave" secureTextEntry={true}/>
              
              
              <TouchableOpacity onPress={handleSignIn} style={[styles.button, {backgroundColor: '#00CFEB'}]}>
                <Text style={styles.buttontext}>Iniciar sesion</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToSignup} style={[styles.button, {backgroundColor: '#6792F0'}]}>
                <Text style={styles.buttontext}>Registrarse</Text>
              </TouchableOpacity>
              

            </View>
        </ScrollView>
      </View>
    );
  }

  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    paddingBottom: '20%',
    paddingTop: '2%',
  },
  image: {

  },
  scroll: {
    width: "100%",
  },

  login: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    width: "90%",
    height: "100%",
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: 'center',
    paddingVertical: "10%",
    paddingBottom: "20%",
    borderRadius: 20,
  },

  input: {
    borderWidth: 1,
    width: "80%",
    height: "15%",
    marginBottom: "5%",
    marginTop: '1%',
    backgroundColor: '#eeeeee',
    paddingLeft: 5,
    borderRadius: 8,
  },
  button: {
    width: "80%",
    marginVertical: "2%",
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,

  },
  buttontext: {
    textAlign: 'center',
    paddingVertical: "4%",
    fontSize: 15,
    color: 'white',
  }

});
