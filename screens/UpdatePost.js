import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  FlatList
} from "react-native";

import firebase from "../database/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import PostCard from "../components/PostCard";
import { useMap } from "../functions/usemap";

import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";




const UpdatePostScreen = (props) => {

  const [state, setState] = useState(initialState);
  const [date1Picker, setDate1Picker] = useState(false);
  const [date2Picker, setDate2Picker] = useState(false);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [post, setPost] = useState('');
  const [posc, setPosc] = useState(post.ubicacion);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPostById = async (id) => {
    const dbRef = firebase.db.collection("publicaciones").doc(id);
    const doc = await dbRef.get();
    const post = doc.data();
    setPost({ ...post, id: doc.id });
    
    console.log(posc)
    setLoading(false);
    
  };

  const {
    mapRef,
    selectedMarker,
    handleNavigateToPoint,
    handelResetInitialPosition,
  } = useMap();


  useEffect(() => {
    getPostById(props.route.params.postId);
  }, []);

  useEffect(() => {
    
    if (props.route.params.sharep) {
      setPosc({ ...props.route.params.sharep });
    } else {
        setPosc(post.ubicacion);
      }
    
  }, [props.route.params.sharep, post.ubicacion]);

    //image upload
    const [images, setImages] = useState([]);
    const [b64Images, setB64Images] = useState([]);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const flatListRef = (useRef < FlatList) | (null > null);
    const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };
    const [activeIndex, setActiveIndex] = useState(0);
    const onViewRef = useRef(({ changed }) => {
      if (changed[0].isViewable) {
        setActiveIndex(changed[0].index);
      }
    });

  const initialState = {
    titulo: "",
    descripcion: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_publicacion: "",
    ubicacion: "",
  };

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

  const goToMap = () => {
    props.navigation.navigate("Crear Ubicacion", {
      edit: 1,
    });
  };

  const handleImageUpload = async () => {
    // pidiendo permisos
    const cameraStatus = await Camera.requestPermissionsAsync();
    setHasCameraPermission(cameraStatus.status === "granted");

    const galleryStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasGalleryPermission(galleryStatus.status === "granted");

    pickImage();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    console.log(result);
    if (!result.cancelled) {
      setImages([...images, result]);
      setB64Images([...images.map((item) => item.base64), result.base64]);
    }
  };


  const handleChangeText = (value, name) => {
    setState({ ...state, [name]: value });
    setPost({ ...post, [name]: value});
  };

  const printd1 = date1.getDate() + '-' + date1.getMonth() + '-' + date1.getFullYear();
  const printd2 = date2.getDate() + '-' + date2.getMonth() + '-' + date2.getFullYear();
  const thisDate = new Date();

  const updatePost = async () => {

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
          ubicacion: posc,
          images: '',
        });
        Alert.alert('Publicacion actualizada');
        props.navigation.goBack();
      };
    }


    if (!post) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    } else {

  return (
    <ScrollView style={styles.container}>


      <View style={styles.square}>
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Titulo"
            multiline={true}
            numberOfLines={1}
            onChangeText={(value) => handleChangeText(value, "titulo")}
            value={post.titulo}
            maxLength={30}
            style={styles.input}
          />
        </View>

        {/* Input */}
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Descripcion"
            multiline={true}
            numberOfLines={3}
            onChangeText={(value) => handleChangeText(value, "descripcion")}
            value={post.descripcion}
            maxLength={100}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Precio por noche"
            onChangeText={(value) => handleChangeText(value, "precio")}
            keyboardType={"numeric"}
            value={post.precio}
            maxLength={3}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Cantidad maxima de personas"
            onChangeText={(value) => handleChangeText(value, "max_personas")}
            keyboardType={"numeric"}
            value={post.max_personas}
            maxLength={3}
            style={styles.input}
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
        {/* DATE PICKERS */}

          

          {posc && (
            <TouchableOpacity onPress={() => {goToMap()}}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.mapStyle}
              showsUserLocation={true}
              region={{
                latitude: posc.latitude,
                longitude: posc.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >

              {post.ubicacion !== "" && (
                <Marker
                  coordinate={{
                    latitude: posc.latitude,
                    longitude: posc.longitude,
                  }}
                />
              )}
            </MapView>
            </TouchableOpacity>
          )}
            
          
        

      <View style={styles.button}>
        <TouchableOpacity style={styles.button} onPress={() => updatePost()}>
          <Text style={styles.buttontext} >Actualizar</Text>
        </TouchableOpacity>
      </View>

      </View>
    </ScrollView>
    
  )}
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: "50%",
    backgroundColor: "#ffffff",
  },
  inputGroup: {
    flex: 1,
  },

  square: {
    width: "100%",
    padding: 20,
  },
  uploadImages: {
    borderWidth: 1,
    borderColor: "#cecece",
    width: "100%",
    height: 30,
    borderRadius: 15,
    marginTop: 15,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  uploadImagesText: {
    color: "#000000",
    fontWeight: "bold",
  },
  input: {
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
  par: {
    color: "white",
    marginBottom: "5%",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: "25%",
    backgroundColor: "blue",
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
    backgroundColor: "#ffffff",
    marginTop: "4%",
    marginBottom: "10%",
    paddingTop: "5%",
    height: 50,
    borderRadius: 15,
  },
  button2: {
    backgroundColor: "#4287f5",
    marginTop: 30,
    paddingTop: "5%",
    height: 50,
    borderRadius: 15,
  },
  mapStyle: {
    height: 250,
    marginTop: "5%",
    borderRadius: 20,
    borderRadius: 20,
  },
  buttontext: {
    textAlign: "center",
    color: "tomato",
    fontWeight: "bold",
    fontSize: 15,
  },
  buttontext2: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UpdatePostScreen;
