import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";


import Ionicons from "react-native-vector-icons/Ionicons";

//mapa
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useMap } from "../functions/usemap";
import firebase from "../database/firebase";
import { useUserContext } from "../context/userContext";


const PostDetails = (props) => {
  //estado inicial
  const initialState = {
    titulo: "",
    descripcion: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_publicacion: "",
    id_arrendador: "",
    nombre_arrendador: "",
    id_chat: "",
    ubicacion: "",
  };

  const { user, getUser, setUser } = useUserContext();
  const [post, setPost] = useState(initialState);
  const [book, setBook] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const finicio = book.fecha_inicio;
  const ffinal = book.fecha_fin;
  const fpublic = post.fecha_publicacion;
  const thisDate = new Date();

  const finicio2 = new Date(finicio.seconds * 1000);
  const ffinal2 = new Date(ffinal.seconds * 1000);
  const fpublic2 = new Date(fpublic.seconds * 1000);

  //obtener usuario

  //funciones del mapa

  const {
    mapRef,
    selectedMarker,
    handleNavigateToPoint,
    handelResetInitialPosition,
  } = useMap();

  //obtener datos de la publicacion actual
  const getPostById = async (id) => {
    const dbRef = firebase.db.collection("publicaciones").doc(id);
    const doc = await dbRef.get();
    const post = doc.data();
    setPost({ ...post, id: doc.id });
    setLoading(false);
  };

  const getBookById = async (id) => {
    const dbRef = firebase.db.collection("reservaciones").doc(id);
    const doc = await dbRef.get();
    const book = doc.data();
    setBook({ ...book, id: doc.id });
    getPostById(book.id_publicacion);
    
    
  };

  const printd1 =
    finicio2.getDate() +
    "-" +
    (finicio2.getMonth() + 1) +
    "-" +
    finicio2.getFullYear();
  const printd2 =
    ffinal2.getDate() +
    "-" +
    (ffinal2.getMonth() + 1) +
    "-" +
    ffinal2.getFullYear();
  const printd3 =
    fpublic2.getDate() +
    "-" +
    (fpublic2.getMonth() + 1) +
    "-" +
    fpublic2.getFullYear();

  //cargar al iniciar
  useEffect(() => {
    
    getBookById(props.route.params.bookId);
 
    
  }, [props.route.params.bookId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  } else {
    return (
      <ScrollView style={styles.container}>


        <View style={styles.square}>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>Arrendador:</Text>
            <Text style={styles.par}>{post.nombre_arrendador}</Text>
          </View>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>Primer dia:</Text>
            <Text style={styles.par}>{printd1}</Text>
          </View>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>Ultimo dia:</Text>
            <Text style={styles.par}>{printd2}</Text>
          </View>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>A nombre de:</Text>
            <Text style={styles.par}>{book.nombre_huesped}</Text>
          </View>

          <View style={styles.parWrapper}>
            <Text style={styles.par}>Total:</Text>
            <Text style={styles.par}>${book.total}</Text>
          </View>

          <View style={styles.parWrapper}>
            <Text style={styles.par}>Contacto:</Text>
            <Text style={styles.par}>
              <Ionicons name={"logo-whatsapp"} size={20} color={"green"}>
                <Text style={{ color: "#000" }}>{post.contacto}</Text>
              </Ionicons>
            </Text>
          </View>

          <TouchableOpacity>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.mapStyle}
              showsUserLocation={true}
              onPress={() => {
                props.navigation.navigate("Ver Ubicacion", {
                  dposition: post.ubicacion,
                });
              }}
              region={{
                latitude: post?.ubicacion.latitude,
                longitude: post?.ubicacion.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {post.ubicacion !== "" && (
                <Marker
                  coordinate={{
                    latitude: post?.ubicacion.latitude,
                    longitude: post?.ubicacion.longitude,
                  }}
                />
              )}
            </MapView>
          </TouchableOpacity>


        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: "50%",
  },
  mapStyle: {
    flex: 1,
    width: "100%",
    height: 300,
    marginBottom: "5%",
    borderRadius: 20,
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

  square: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "white",
    padding: 30,
  },
  title: {
    color: "#000000",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  imagesWrapper: {
    backgroundColor: "#FFFFFF",
  },
  desc: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginTop: "15%",
    marginBottom: "5%",
    width: "40%",
  },
  desc2: {
    textAlign: "center",
    color: "#000000",
    padding: 10,
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 15,
  },
  parWrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  par: {
    color: "#000000",
    marginVertical: "4%",
    fontSize: 16,
    fontWeight: "bold",
  },
  parImages: {
    color: "#000000",
    marginVertical: "4%",
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 30,
  },
  button: {
    width: "60%",
    marginHorizontal: "20%",
    backgroundColor: "#fff",
    marginTop: "10%",
    marginBottom: "10%",
    borderRadius: 5,
    padding: "2%",
    paddingHorizontal: "2%",
  },
  buttontxt: {
    color: "#5cc3ff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PostDetails;