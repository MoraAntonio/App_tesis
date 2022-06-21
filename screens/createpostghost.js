import React, { useState } from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import firebase from "../database/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer } from "@react-navigation/native";


const CreatePostScreen = (props) => {
  const initalState = {
    titulo: "",
    descripcion: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_publicacion: "",
  };


  const [state, setState] = useState(initalState);
  const [date1Picker, setDate1Picker] = useState(false);
  const [date2Picker, setDate2Picker] = useState(false);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());


  function showDate1Picker() {
    state.fecha_inicio = firebase.getFirestore.Timestamp.fromDate(date1);
    setDate1Picker(true);
  };

  function showDate2Picker() {
    setDate2Picker(true);
  };

  function onDate1Selected(event, value) {
    setDate1(value);
    setDate1Picker(false);
  };

  function onDate2Selected(event, value) {
    setDate2(value);
    setDate2Picker(false);
  };


  const handleChangeText = (value, name) => {
    setState({ ...state, [name]: value });
  };

  const saveNewPost = async () => {
    if (state.name === "") {
      alert("please provide a name");
    } else {

      try {
        await firebase.db.collection("publicaciones").add({
            titulo: state.titulo,
            descripcion: state.descripcion,
            precio: state.precio,
            fecha_inicio: state.fecha_inicio,
            fecha_fin: state.fecha_fin,
            fecha_publicacion: new Date(),
        });
      } catch (error) {
        console.log(error)
      }
    }
  };

  return (
    <ScrollView style={styles.container}>


      {/* Email Input */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Titulo"
          multiline={true}
          numberOfLines={4}
          onChangeText={(value) => handleChangeText(value, "titulo")}
          value={state.titulo}
        />
      </View>

      {/* Input */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Descripcion"
          multiline={true}
          numberOfLines={4}
          onChangeText={(value) => handleChangeText(value, "descripcion")}
          value={state.descripcion}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Precio por noche"
          onChangeText={(value) => handleChangeText(value, "precio")}
          value={state.precio}
        />
        
      </View>


      <Text>Date1 = {date1.toDateString()}</Text>
      <Text>Date2 = {date2.toDateString()}</Text>

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
          <View style={{ margin: 10 }}>
            <Button title="Show Date Picker" color="green" onPress={showDate1Picker} />
          </View>
        )}

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
          <View style={{ margin: 10 }}>
            <Button title="Show Date Picker" color="green" onPress={showDate2Picker} />
          </View>
        )}

      <View style={styles.button}>
        <TouchableOpacity style={styles.button} onPress={() => saveNewPost()}>
          <Text style={styles.buttontext} >Publicar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
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

export default CreatePostScreen;
