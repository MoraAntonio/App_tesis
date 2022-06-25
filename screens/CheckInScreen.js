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
  Alert,
} from "react-native";

import firebase from "../database/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import PostDetails from "./postDetails";


const CheckInScreen = (props) => {

  const auth = getAuth();
  const user = auth.currentUser;

    const initialState = {
          cpers: '',
        };
      
    const [state, setState] = useState(initialState);
    const [post, setPost]   = useState('');
    const [date1Picker, setDate1Picker] = useState(false);
    const [date2Picker, setDate2Picker] = useState(false);
    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    
    const getPostById = async (id) => {
        const dbRef = firebase.db.collection("publicaciones").doc(id);
        const doc = await dbRef.get();
        const post = doc.data();
        setPost({ ...post, id: doc.id });
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

      const printd1 = date1.getDate() + '-' + date1.getMonth() + '-' + date1.getFullYear();
      const printd2 = date2.getDate() + '-' + date2.getMonth() + '-' + date2.getFullYear();
      
      const tdifference = date2.getTime() - date1.getTime();
  
      const days = tdifference / (1000 * 3600 * 24); 
      const thisDate = new Date();
      

      const goSaveCheck = () => {
        if (!state.cpers){
          Alert.alert('Debe ingresar el numero de personas a hospedarse')
        }
        else if (isNaN(state.cpers)) {
          Alert.alert('Debe ingresar un valor numerico')
        } else if (state.cpers > post.max_personas) {
          Alert.alert('El maximo de personas para este servicio es de: ' + post.max_personas)
        }
        else if (printd1 === printd2){
          Alert.alert('La fecha de inicio no puede ser la misma que la fecha final')
        }
        else if (date1 > date2) {
          Alert.alert('La fecha de inicio no puede ser despues de la fecha de cierre')
        }
        else if (date2 < thisDate) {
          Alert.alert('La fecha de cierre no puede ser antes de la fecha actual')
        }
        else {

          const checkhold = {
            postId: post.id,
            ndays: days,
            cdate1: date1,
            cdate2: date2,
            cpers: state.cpers,
          }

          props.navigation.navigate('Confirmar pago', {
            checkhold: checkhold
          })
        }
        
      }

      useEffect(() => {
        getPostById(props.route.params.postId);
      }, [props.route.params.postId]);

      return (

      <ScrollView style={styles.container}>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Cantidad de personas"
          onChangeText={(value) => handleChangeText(value, "cpers")}
          value={state.cpers}
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

        <TouchableOpacity style={styles.button} onPress={() => goSaveCheck()}>
          <Text style={styles.buttontext} >Registrar reservacion</Text>
        </TouchableOpacity>
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