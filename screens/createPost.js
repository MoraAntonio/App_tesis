import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from "react-native";

import firebase from "../database/firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import storage from '@react-native-firebase/storage';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useMap } from "../functions/usemap";
import PostCard from "../components/PostCard";

import { getAuth } from "firebase/auth";

import * as TaskManager from "expo-task-manager"
import * as Location from "expo-location"
import * as ImagePicker from 'expo-image-picker';
import { Marker } from "react-native-svg";
import { Camera } from 'expo-camera';


const LOCATION_TASK_NAME = "LOCATION_TASK_NAME"
let foregroundSubscription = null

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error)
    return
  }
  if (data) {
    // Extract location coordinates from data
    const { locations } = data
    const location = locations[0]
    if (location) {
      console.log("Location in background", location.coords)
    }
  }
})


const CreatePostScreen = (props) => {

  //image upload

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
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

  const handleImageUpload = async () => {

    // pidiendo permisos
    const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

    pickImage();

  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    console.log(result)
    if (!result.cancelled) {
      setImages([...images, result]);
      setB64Images([...images.map(item=>item.base64), result.base64])
    }

  }

  // Request permissions right after starting the app


  const requestPermissions = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync()
    if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
  }

  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    requestPermissions()
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync()
    if (!granted) {
      console.log("location tracking denied")
      return
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove()

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      location => {
        setPosition(location.coords)
      }
    )

  }

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    foregroundSubscription?.remove()
  }


  const auth = getAuth();
  const user = auth.currentUser;


  const initalState = {
    titulo: "",
    descripcion: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_publicacion: "",
    max_personas: "",
  };

  const {
    mapRef,
    selectedMarker,
    handleNavigateToPoint,
    handelResetInitialPosition,
  } = useMap();





  const [state, setState] = useState(initalState);
  const [date1Picker, setDate1Picker] = useState(false);
  const [date2Picker, setDate2Picker] = useState(false);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [position, setPosition] = useState({})
  const [marker, setMarker] = useState(null);




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

  const printd1 = date1.getDate() + '-' + date1.getMonth() + '-' + date1.getFullYear();
  const printd2 = date2.getDate() + '-' + date2.getMonth() + '-' + date2.getFullYear();


  const saveNewPost = async () => {

    const thisDate = new Date();

    if (!state.titulo) {
      Alert.alert('Debe ingresar un titulo para la publicacion');
    }
    else if (state.titulo.length < 10) {
      Alert.alert('El titulo ndebe tener mas de 10 caracteres')
    }
    else if (!state.descripcion) {
      Alert.alert('La descripcion no puede estar vacia')
    }
    else if (state.descripcion.length < 20) {
      Alert.alert('La descripcion debe tener al menos 20 caracteres')
    }
    else if (!state.precio) {
      Alert.alert('El precio no puede estar en blanco')
    }
    else if (isNaN(state.precio)) {
      Alert.alert('El precio debe ser un valor numerico')
    }
    else if (state.precio < 5) {
      Alert.alert('El precio no puede ser menor a 5 dolares')
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
    else {

      console.log(posc.latitude + ',' + posc.longitude)

      console.log(b64Images.length)
      try {
        await firebase.db.collection("publicaciones").add({
          titulo: state.titulo,
          descripcion: state.descripcion,
          precio: state.precio,
          fecha_inicio: date1,
          fecha_fin: date2,
          fecha_publicacion: new Date(),
          id_arrendador: user.uid,
          nombre_arrendador: user.displayName,
          ubicacion: posc,
          max_personas: state.max_personas,
          images: b64Images,
        });
        Alert.alert('Publicacion creada!');
      } catch (error) {
        console.log(error)
      }
    }//close ifs
  };

  const goToMap = () => {
    stopForegroundUpdate();
    props.navigation.navigate('Crear Ubicacion');
  }

  const [posc, setPosc] = useState(null);


  useEffect(() => {

    if (props.route.params.sharep) {
      setPosc({ ...props.route.params.sharep });
      console.log(props.route.params.sharep);
    }
    else {
      startForegroundUpdate();
    }

  }, [props.route.params.sharep])

  useEffect(() => {
    console.log(images)
  }, [images])





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
            value={state.titulo}
            maxLength={30}
          />
        </View>

        {/* Input */}
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Descripcion"
            multiline={true}
            numberOfLines={3}
            onChangeText={(value) => handleChangeText(value, "descripcion")}
            value={state.descripcion}
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Precio por noche"
            onChangeText={(value) => handleChangeText(value, "precio")}
            keyboardType={'numeric'}
            value={state.precio}
            maxLength={3}
          />

        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Cantidad maxima de personas"
            onChangeText={(value) => handleChangeText(value, "max_personas")}
            keyboardType={'numeric'}
            value={state.max_personas}
            maxLength={3}
          />

        </View>

        {posc !== null && (
          <View>
            <Text>{posc.latitude}</Text>
            <Text>{posc.longitude}</Text>
          </View>
        )}



        <TouchableOpacity
          onPress={() => { goToMap() }}
          onLongPress={() => { console.log("pressed") }}
        >
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            showsUserLocation={true}
            initialRegion={{
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: 0.0100,
              longitudeDelta: 0.0100,
            }}>



            <Marker coordinate={{
              latitude: position.latitude,
            }} />






          </MapView>
        </TouchableOpacity>


        <Text styles={styles.par}>Fecha de inicio:  {printd1}</Text>


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
            <TouchableOpacity style={styles.button} onPress={showDate1Picker}>
              <Text style={styles.buttontext}>Seleccionar Fecha de inicio</Text>
            </TouchableOpacity>
          </View>
        )}


        <Text styles={styles.par} >Fecha de cierre: {printd2}</Text>

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
            <TouchableOpacity style={styles.button} onPress={showDate2Picker}>
              <Text style={styles.buttontext}>Seleccionar Fecha de cierre</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.button2} onPress={() => handleImageUpload()}>
          <Text style={styles.buttontext2} >Subir imagenes</Text>
        </TouchableOpacity>

        <PostCard
                heading={''}
                images={images.map(item => item.uri)}
                subheading={''}
                onPress={() =>{
                  }
                }
                home={false}
              />

          
        <TouchableOpacity style={styles.button2} onPress={() => saveNewPost()}>
          <Text style={styles.buttontext2} >Publicar</Text>
        </TouchableOpacity>


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '50%',
  },
  inputGroup: {
    flex: 1,
    marginTop: '5%',
    marginBottom: '5%',
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    height: '2%',
    backgroundColor: '#ffffff',
  },

  square: {
    width: '88%',
    marginTop: '3%',
    marginHorizontal: '6%',
    backgroundColor: '#5cc3ff',
    paddingHorizontal: '5%',
    paddingTop: '7%',
    paddingBottom: '5%',
    borderRadius: 20,
    marginBottom: '20%',
    color: 'white',
  },
  par: {
    color: 'white',
    marginBottom: '5%',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: '25%',
    backgroundColor: 'blue',
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
    backgroundColor: '#ffffff',
    marginTop: '4%',
    marginBottom: '10%',
    paddingTop: '5%',
    height: 50,
    borderRadius: 15,
  },
  button2: {
    backgroundColor: '#4287f5',
    marginTop: '2%',
    marginBottom: '50%',
    paddingTop: '5%',
    height: 50,
    borderRadius: 15,
  },
  mapStyle: {
    height: 250,
    marginTop: '5%',
    borderRadius: 20,
    borderRadius: 20,
  },
  buttontext: {
    textAlign: 'center',
    color: 'tomato',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttontext2: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreatePostScreen;
