import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import firebase from "../database/firebase";
import axios from "axios";
import { useUserContext } from "../context/userContext";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import PostCard from "../components/PostCard";
import { useMap } from "../functions/usemap";

import { getAuth } from "firebase/auth";

import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Image } from "react-native-elements";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    // Extract location coordinates from data
    const { locations } = data;
    const location = locations[0];
    if (location) {
      console.log("Location in background", location.coords);
    }
  }
});

const CreatePostScreen = (props) => {
  //image upload
  const { user, setUser } = useUserContext();
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

  // Request permissions right after starting the app

  const requestPermissions = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.granted) await Location.requestBackgroundPermissionsAsync();
  };

  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    requestPermissions();
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove();

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      (location) => {
        setPosition(location.coords);
      }
    );
  };

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    foregroundSubscription?.remove();
  };


  const initalState = {
    titulo: "",
    descripcion: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_publicacion: "",
    max_personas: "",
    contacto: ""
  };

  const {
    mapRef,
    selectedMarker,
    handleNavigateToPoint,
    handelResetInitialPosition,
  } = useMap();


  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [state, setState] = useState(initalState);
  const [date1Picker, setDate1Picker] = useState(false);
  const [date2Picker, setDate2Picker] = useState(false);
  const [position, setPosition] = useState(null);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [isHere, setIsHere] = useState(true);
  const [direccion, setDireccion] = useState({
    estado: "",
    ciudad: "",
  });

  function showDate1Picker() {
    setDate1Picker(true);
  }

  function showDate2Picker() {
    setDate2Picker(true);
  }

  function onDate1Selected(event, value) {
    setDate1(value);
    setDate1Picker(false);
  }

  function onDate2Selected(event, value) {
    setDate2(value);
    setDate2Picker(false);
  }

  const handleChangeText = (value, name) => {
    setState({ ...state, [name]: value });
  };

  const printd1 =
    date1.getDate() + "-" + (date1.getMonth() + 1) + "-" + date1.getFullYear();
  const printd2 =
    date2.getDate() + "-" + (date2.getMonth() + 1)  + "-" + date2.getFullYear();

  const saveNewPost = async () => {
    const thisDate = new Date();

    if (!state.titulo) {
      Alert.alert("Debe ingresar un titulo para la publicacion");
    } else if (state.titulo.length < 10) {
      Alert.alert("El titulo ndebe tener mas de 10 caracteres");
    } else if (!state.descripcion) {
      Alert.alert("La descripcion no puede estar vacia");
    } else if (state.descripcion.length < 20) {
      Alert.alert("La descripcion debe tener al menos 20 caracteres");
    } else if (!state.precio) {
      Alert.alert("El precio no puede estar en blanco");
    } else if (isNaN(state.precio)) {
      Alert.alert("El precio debe ser un valor numerico");
    } else if (state.precio < 5) {
      Alert.alert("El precio no puede ser menor a 5 dolares");
    } else if (printd1 === printd2) {
      Alert.alert(
        "La fecha de inicio no puede ser la misma que la fecha final"
      );
    } else if (date1 > date2) {
      Alert.alert(
        "La fecha de inicio no puede ser despues de la fecha de cierre"
      );
    } else if (date2 < thisDate) {
      Alert.alert("La fecha de cierre no puede ser antes de la fecha actual");
    } else if (!isHere) {
      Alert.alert(
        "La ubicacion debe encontrarse dentro del territorio venezolano"
      );
    }
      else if (!posc) {
        Alert.alert('Verifique su ubicacion en el mapa');
      }
      else if (images.length == 0) {
      Alert.alert(
        "Debe subir al menos una imagen"
      );
    }
    else {

      Alert.alert(user.uid)
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
          ubicacion: posc || position,
          max_personas: state.max_personas,
          images: b64Images,
          contacto: state.contacto,
        });
        Alert.alert("Publicacion creada!");
        props.navigation.goBack()
      } catch (error) {
        console.log(error);
      }
    } //final de los ifs
  }; //final de la funcion de validacion

  const goToMap = () => {
    stopForegroundUpdate();
    props.navigation.navigate("Crear Ubicacion", {
      edit: 0,
    });
  };

  const getPlaceName = async (lat, lng) => {
    const response = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=es`
    );

    const cname = response.data.countryName;
    if (cname.toLowerCase() !== "venezuela") {
      console.log("La ubicacion no esta en Venezuela!");
      setIsHere(false);
    } else {
      setDireccion({
        estado: response.data.localityInfo.administrative[2].isoName,
        ciudad: response.data.city,
      });
      setIsHere(true);
    }
  };

  const [posc, setPosc] = useState(null);

  useEffect(() => {
    if (props.route.params.sharep) {
      setPosc({ ...props.route.params.sharep });
      getPlaceName(
        props.route.params.sharep.latitude,
        props.route.params.sharep.longitude
      );
      console.log(props.route.params.sharep);
    } else {
      startForegroundUpdate();
    }
  }, [props.route.params.sharep]);

  useEffect(() => {
  }, []);

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
            value={state.descripcion}
            maxLength={100}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Precio por noche"
            onChangeText={(value) => handleChangeText(value, "precio")}
            keyboardType={"numeric"}
            value={state.precio}
            maxLength={3}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Cantidad maxima de personas"
            onChangeText={(value) => handleChangeText(value, "max_personas")}
            keyboardType={"numeric"}
            value={state.max_personas}
            maxLength={3}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Contacto Whatsapp"
            onChangeText={(value) => handleChangeText(value, "contacto")}
            keyboardType={"numeric"}
            value={state.contacto}
            maxLength={11}
            style={styles.input}
          />
        </View>



        {position && (
          <TouchableOpacity
            onPress={() => {
              goToMap();
            }}
            onLongPress={() => {
              console.log("pressed"),
              {
                platitude: position.latitude,
                plongitude: position.longitude,
              };
            }}
          >
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.mapStyle}
              showsUserLocation={true}
              region={{
                latitude: posc?.latitude ? posc.latitude : position.latitude,
                longitude: posc?.longitude
                  ? posc.longitude
                  : position.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: posc?.latitude ? posc.latitude : position.latitude,
                  longitude: posc?.longitude
                    ? posc.longitude
                    : position.longitude,
                }}
              />
            </MapView>
          </TouchableOpacity>
        )}

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

        <TouchableOpacity
          style={styles.uploadImages}
          onPress={() => handleImageUpload()}
        >
          <Text style={styles.uploadImagesText}>Click para subir imagenes</Text>
        </TouchableOpacity>
      </View>

      {images?.length > 0 && (
        <PostCard
          heading={""}
          images={images.map((item) => item.uri)}
          subheading={""}
          onPress={() => { }}
          home={false}
        />
      )}


      <View style={styles.square}>
        <TouchableOpacity style={styles.button2} onPress={() => saveNewPost()}>
          <Text style={styles.buttontext2}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
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

export default CreatePostScreen;