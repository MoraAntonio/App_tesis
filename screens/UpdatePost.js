import React, { useState, useEffect } from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import firebase from "../database/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer } from "@react-navigation/native";




const UpdatePostScreen = (props) => {

  const getPostById = async (id) => {
    const dbRef = firebase.db.collection("publicaciones").doc(id);
    const doc = await dbRef.get();
    const post = doc.data();
    setPost({ ...post, id: doc.id });
    console.log(post);

  };

  useEffect(() => {
    getPostById(props.route.params.postId);
    
  }, []);

  const initialState = {
    titulo: "",
    descripcion: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_publicacion: "",
  };




  const [state, setState] = useState(initialState);
  const [date1Picker, setDate1Picker] = useState(false);
  const [date2Picker, setDate2Picker] = useState(false);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [post, setPost] = useState('');


  function showDate1Picker() {
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

  const updatePost = async () => {

    const printd1 = date1.getDate() + '-' + date1.getMonth() + '-' + date1.getFullYear();
    const printd2 = date2.getDate() + '-' + date2.getMonth() + '-' + date2.getFullYear();
    const thisDate = new Date();

    if (!state.titulo){
      Alert.alert('Debe ingresar un titulo para la publicacion');
    }
    else if (state.titulo.length < 10 ) {
      Alert.alert('El titulo ndebe tener mas de 10 caracteres')
    }
    else if(!state.descripcion) {
      Alert.alert('La descripcion no puede estar vacia')
    }
    else if (state.descripcion.length < 20 ) {
      Alert.alert('La descripcion debe tener al menos 20 caracteres')
    }
    else if (!state.precio){
      Alert.alert('El precio no puede estar en blanco')
    }
    else if (isNaN(state.precio)){
      Alert.alert('El precio debe ser un valor numerico')
    }
    else if (state.precio < 5) {
      Alert.alert('El precio no puede ser menor a 5 dolares')
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

      
    const userRef = firebase.db.collection("publicaciones").doc(props.route.params.postId);
        await userRef.set({
          titulo: state.titulo,
          descripcion: state.descripcion,
          precio: state.precio,
          fecha_inicio: state.fecha_inicio,
          fecha_fin: state.fecha_fin,
        });
        Alert.alert('Publicacion actualizada');
        props.navigation.goBack();
      };
    }



  return (
    <ScrollView style={styles.container}>


      {/* Email Input */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Titulo"
          multiline={true}
          numberOfLines={4}
          onChangeText={(value) => handleChangeText(value, "titulo")}
          value={post.titulo}
        />
      </View>

      {/* Input */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Descripcion"
          multiline={true}
          numberOfLines={4}
          onChangeText={(value) => handleChangeText(value, "descripcion")}
          value={post.descripcion}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Precio por noche"
          keyboardType='numeric'
          onChangeText={(value) => handleChangeText(value, "precio")}
          value={post.precio}
        />
        
      </View>


      <Text>Date1 = {date1.toDateString()}</Text>

      {date1Picker && (
          <DateTimePicker
            value={new Date(post.fecha_inicio*1000)}
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

        
      <Text>Date2 = {date2.toDateString()}</Text>

        {date2Picker && (
          <DateTimePicker
            value={new Date(post.fecha_fin*1000)}
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
        <TouchableOpacity style={styles.button} onPress={() => updatePost()}>
          <Text style={styles.buttontext} >Actualizar</Text>
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
    backgroundColor: '#4287f5',
    marginTop: 5,
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
    height: 50,
    borderRadius: 15,
    marginBottom: '30%',
  },
  buttontext: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default UpdatePostScreen;
