import React, {useEffect} from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import {NavigationContainer, useNavigation } from '@react-navigation/native';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig, app} from '../database/firebase';
import firebase from 'firebase/compat';
import { State } from 'react-native-gesture-handler';



  export default function SignUpScreen({route, navigation}) {

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [fullname, setFullname] = React.useState('')
    const auth = getAuth(app);


    const goToSignup = () => {
      navigation.navigate('SignUp');
    }

    const register = () => {
      const auth = getAuth()
      createUserWithEmailAndPassword(auth, email, password)
        .then((authUser) => {
          const user = authUser.user
          updateProfile(user, {
            displayName: fullname,
          })
          
            .then(() => console.log('Profile Updated!'),
            navigation.navigate('UserDetails'))
            .catch((error) => console.log(error.message))
        })
        .catch((error) => alert(error.message))
    }
  

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}> 
            <View style={styles.login}>

                <Text style={{fontSize: 17, fontWeight: '400', color: 'black'}}>Nombre completo</Text>
                <TextInput onChangeText={(text) => setFullname(text)} style={styles.input} placeholder="Nombre y apellido" />
              
                <Text style={{fontSize: 17, fontWeight: '400', color: 'black'}}>E-mail</Text>
                <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder="ejemplo@ejemplo.com" />
              
                <Text style={{fontSize: 17, fontWeight: '400', color: 'black'}}>Clave</Text>
                <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder="Clave" secureTextEntry={true}/>

              <TouchableOpacity onPress={register} style={[styles.button, {backgroundColor: 'tomato'}]}>
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
  },
  image: {

  },
  scroll: {
    width: "100%",
    height: "100%",
  },

  login: {
    width: "90%",
    height: "100%",
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: 'center',
    paddingVertical: "10%",
    paddingBottom: "20%",
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
    backgroundColor: 'orange',
  },
  buttontext: {
    textAlign: 'center',
    paddingVertical: "4%",
    fontSize: 15,
    color: 'white',
  }

});