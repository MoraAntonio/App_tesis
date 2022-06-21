import React, { useState, useEffect } from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ShadowPropTypesIOS,
} from "react-native";

import firebase from "../database/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer } from "@react-navigation/native";
import { getAuth } from "firebase/auth";


const CheckInScreen = (props) => {

  const auth = getAuth();
  const user = auth.currentUser;

    const initialState = {
          cantidadpers: '',
        };
      
    const [state, setState] = useState(initialState);
    const [post, setPost] = useState('');
    const [date1Picker, setDate1Picker] = useState(false);
    const [date2Picker, setDate2Picker] = useState(false);
    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    
    const getPostById = async () => {
        const dbRef = firebase.db.collection("publicaciones").doc(props.route.params.postId);
        const doc = await dbRef.get();
        const post = doc.data();
        setPost({ ...post, id: doc.id });
        console.log(post);
      };


    const saveCheck = async () => {

        try {
          await firebase.db.collection("reservaciones").add({
            fecha_inicio: date1,
            fecha_fin: date2,
            fecha_creacion: new Date(),
            id_huesped: user.uid,
            nombre_huesped: user.displayName,
            id_publicacion: post.id,
            cantidad_personas: 'si',
        });
        props.navigation.navigate('PDetails', {
          postId: post.id,
        })
            console.log(user);
            
          } catch (error) {
            console.log(error)
          }

    };

    const handleChangeText = (value, name) => {
      setState({ ...state, [name]: value });
    };

  
      function showDate1Picker() {
        setDate1Picker(true);
      };
    
      function showDate2Picker() {
        setDate2Picker(true);
      };
    
      function onDate1Selected(event, value) {
        setDate1(value);
        state.fecha_inicio = date1;
        setDate1Picker(false);
      };
    
      function onDate2Selected(event, value) {
        setDate2(value);
        state.fecha_fin = date2;
        setDate2Picker(false);
      };

      useEffect(() => {
        getPostById();
      }, []);

      return (

      <ScrollView style={styles.container}>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Cantidad de personas"
          onChangeText={(value) => handleChangeText(value, "precio")}
          value={state.precio}
          keyboardType={'number-pad'}
        />
        
      </View>

      <Text style={styles.list}>Fecha de inicio</Text>
      <Text style={styles.list}>{date1.toDateString()}</Text>


      {date1Picker && (
          <DateTimePicker
            value={date1}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={onDate1Selected}
          />
        )}

        {!date1Picker && (
            <TouchableOpacity style={styles.button} onPress={showDate1Picker}>
              <Text  style={styles.buttontext}>Seleccionar fecha de inicio</Text>
            </TouchableOpacity>
        )}

      <Text style={styles.list}>Fecha de cierre</Text>
      <Text style={styles.list}>{date2.toDateString()}</Text>

        {date2Picker && (
          <DateTimePicker
            value={date2}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={onDate2Selected}
          />
        )}

        {!date2Picker && (
          <TouchableOpacity style={styles.button} onPress={showDate2Picker}>
            <Text  style={styles.buttontext}>Seleccionar fecha de cierre</Text>
          </TouchableOpacity>
        )}

      <View style={styles.button}>
        <TouchableOpacity style={styles.button} onPress={() => saveCheck()}>
          <Text style={styles.buttontext} >Registrar reservacion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    )
    
}

export default CheckInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 35,
    },
    inputGroup: {
      flex: 1,
      padding: 0,
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#cccccc",
    },
    loader: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      backgroundColor: '#4287f5',
      marginTop: 5,
      marginBottom: '10%',
      paddingTop: '3%',
      paddingBottom: '3%',
      height: 50,
      borderRadius: 15,
    },
    buttontext: {
      textAlign: 'center',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 15,
    },
  });