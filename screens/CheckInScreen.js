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
  Image,
} from "react-native";

import firebase from "../database/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import PostDetails from "./postDetails";
import { useUserContext } from "../context/userContext";



const CheckInScreen = (props) => {
  //import { getAuth } from "firebase/auth";
  const auth = getAuth();
  const user = auth.currentUser;

  const { setUser, getUser } = useUserContext();

  const initialState = {
    cpers: '',
  };

  const [state, setState] = useState(initialState);
  const [post, setPost] = useState('');
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



  useEffect(() => {
    getPostById();
    getUser();
    if (!user) {
      Alert.alert('Debe iniciar sesion para realizar una reservacion');
      props.navigation.navigate('Detalles');
    }
  }, []);


  const goSaveCheck = () => {

    const finicio = post.fecha_inicio;
    const ffinal = post.fecha_fin;
  
    const finicio2 = new Date(finicio.seconds * 1000);
    const ffinal2 = new Date(ffinal.seconds * 1000);



    if (!state.cpers) {
      Alert.alert('Debe ingresar el numero de personas a hospedarse')
    }
    else if (isNaN(state.cpers)) {
      Alert.alert('Debe ingresar un valor numerico')
    } else if (state.cpers > post.max_personas) {
      console.log(state.cpers)
      console.log(post.max_personas)
      Alert.alert('El maximo de personas para este servicio es de: ' + post.max_personas)
    } else if (state.cpers < post.max_personas) {
      
    }
    else if (printd1 === printd2) {
      Alert.alert('La fecha de inicio no puede ser la misma que la fecha final')
    }
    else if (date1 > date2) {
      Alert.alert('La fecha de inicio no puede ser despues de la fecha de cierre')
    }
    else if (date2 < thisDate) {
      Alert.alert('La fecha de cierre no puede ser antes de la fecha actual')
    }
    else if (date1 < finicio2 || date1 > ffinal2) {
      Alert.alert('La fecha que solicita no esta dentro del rango disponible')
    }
    else if (date2 < finicio2 || date2 > ffinal2) {
      Alert.alert('La fecha que solicita no esta dentro del rango disponible')
    }
    else {

      const checkhold = {
        postId: post.id,
        ndays: days,
        cdate1: date1,
        cdate2: date2,
        cpers: state.cpers,
        thumbnail: post.images[0],
        titulo: post.titulo
      }
      console.log(checkhold.titulo)
      props.navigation.navigate('Confirmar pago', {
        checkhold: checkhold
      })
    }

  }

  useEffect(() => {
    getPostById(props.route.params.postId);
    
    if (!user) {
      Alert.alert('Debe iniciar sesion para realizar una reservacion')
      props.navigation.navigate('Detalles')
    }
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

      <View style={{ display: "flex", flexDirection: "row", padding: 0 }}>
        <View
          style={{
            borderWidth: 1,
            height: 50,
            width: "44%",
            margin: 10,
            borderRadius: 5,
            padding: 10,
            borderColor: "#00CFEB",
          }}
        >
          <TouchableOpacity onPress={showDate1Picker}>
            <Text>
              <Image
                style={{ width: 10, height: 10 }}
                source={require("../assets/calendar.png")}
              />{" "}
              Desde:
            </Text>
            <Text style={{ fontSize: 12, width: "100%", marginLeft: 30 }}>
              {printd1 || "Seleccionar"}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderWidth: 1,
            height: 50,
            width: "44%",
            margin: 10,
            borderRadius: 5,
            padding: 10,
            borderColor: "#00CFEB",
          }}
        >
          <TouchableOpacity onPress={showDate2Picker}>
            <Text>
              <Image
                style={{ width: 10, height: 10 }}
                source={require("../assets/calendar.png")}
              />{" "}
              Hasta:
            </Text>
            <Text style={{ fontSize: 12, width: "100%", marginLeft: 30 }}>
              {printd2 || "Seleccionar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DATE PICKERS */}
      {date1Picker && (
        <DateTimePicker
          value={date1}
          mode={"date"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={onDate1Selected}
        />
      )}
      {date2Picker && (
        <DateTimePicker
          value={date2}
          mode={"date"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={onDate2Selected}
        />
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

    borderWidth: 1,
    borderColor: "#f2f2f2",
    width: "100%",
    height: 50,
    marginBottom: "5%",
    marginTop: "1%",
    backgroundColor: "#FFFFFF",
    paddingLeft: 10,
    borderRadius: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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

  },
  buttontext: {
    marginTop: '5%',
    textAlign: 'center',
    color: '#5cc3ff',
    fontWeight: 'bold',
    fontSize: 15,
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
});