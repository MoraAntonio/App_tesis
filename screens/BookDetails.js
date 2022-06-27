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

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'

import Ionicons from 'react-native-vector-icons/Ionicons';

//mapa
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useMap } from "../functions/usemap";
import * as Location from "expo-location"
import firebase from "../database/firebase";
import { AuthErrorCodes, getAdditionalUserInfo, getAuth } from "firebase/auth";

//custom components
import ItemDivider from "../components/ItemDivider";
import { getTsBuildInfoEmitOutputFilePath } from "typescript";



const BookDetails = (props) => {

  //estado inicial
  const initialState = {
    cantidad_personas: '',
    estado_pago: '',
    fecha_creacion: '',
    fecha_fin: '',
    fecha_inicio: '',
    _id_huesped: '',
    id_publicacion: '',
    nombre_huesped: '',
    total: '',
  };

  const initialState2 = {
    titulo: '',
    descripcion: '',
    precio: '',
    fecha_inicio: '',
    fecha_fin: '',
    fecha_publicacion: '',
    id_arrendador: '',
    nombre_arrendador: '',
    ubicacion: '',
  };

  
  const [book, setBook] = useState(initialState);
  const [post, setPost] = useState(initialState2);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  const finicio = book.fecha_inicio;
  const ffinal  = book.fecha_fin;

  const finicio2 = new Date(finicio.seconds*1000);
  const ffinal2  = new Date(ffinal.seconds*1000);

  const printd1 = finicio2.getDate() + '-' + (finicio2.getMonth()+1) + '-' + finicio2.getFullYear();
  const printd2 = ffinal2.getDate() + '-' + (ffinal2.getMonth()+1) + '-' + ffinal2.getFullYear();

  //obtener usuario

  //funciones del mapa

    const {
      mapRef,
      selectedMarker,
      handleNavigateToPoint,
      handelResetInitialPosition,
    } = useMap();





  //obtener datos de la publicacion actual
  const getBookById = async (id) => {
    const dbRef = firebase.db.collection("reservaciones").doc(id);
    const doc = await dbRef.get();
    const book = doc.data();
    setBook({ ...book, id: doc.id });
    console.log(book);
    getPostById(book.id_publicacion);
  };

  const getPostById = async (id) => {
    const dbRef = firebase.db.collection("publicaciones").doc(id);
    const doc = await dbRef.get();
    const post = doc.data();
    setPost({ ...post, id: doc.id });
  };


  //cargar al iniciar
  useEffect(() => {
    getBookById(props.route.params.bookId);

  }, [props.route.params.bookId]);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.square}>

          <Text style={styles.par}></Text>

          {post.ubicacion !== '' && (
            <TouchableOpacity
            >
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.mapStyle}
                showsUserLocation={true}
                onPress={() => {props.navigation.navigate('Ver Ubicacion', {
                  dposition: post.ubicacion,
                })}}
                region={{
                  latitude: post?.ubicacion.latitude,
                  longitude: post?.ubicacion.longitude,
                  latitudeDelta: 0.0100,
                  longitudeDelta: 0.0100,
                }}>
                  {post.ubicacion !== '' && (
    
                    <Marker coordinate={{
                      latitude: post?.ubicacion.latitude,
                      longitude: post?.ubicacion.longitude,
                    }} />
    
                  )
    
                  }
                
    
              </MapView>
            </TouchableOpacity>
          )}

        

              <TouchableOpacity style={styles.button} onPress={() => {props.navigation.navigate('Detalles', {
              postId: post.id 
            })}}>
              <Text style={styles.buttontxt} >Ir a Publicacion</Text>
              </TouchableOpacity>
          
        </View>
      </ScrollView>

    )
    

  

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '50%',
  },
  mapStyle: {
    flex: 1,
    width: '100%',
    height: 300,
    marginBottom: '5%',
    borderRadius: 20,
  },

  square: {
    width: '88%',
    marginTop: '3%',
    marginHorizontal: '6%',
    backgroundColor:  '#5cc3ff',
    paddingHorizontal: '5%',
    paddingTop: '7%',
    paddingBottom: '60%',
    borderRadius: 20,
    marginBottom: '20%',
    color: 'white',
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  desc: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#ffffff',
    textAlign: "center",
    marginTop: '15%',
    marginBottom: '5%',
  },
  desc2: {
    textAlign: 'center',
    marginBottom: '20%',
    color: '#ffffff',
  },
par: {
  color: '#ffffff',
  marginVertical: '4%',
  fontSize: 16,
  fontWeight: 'bold',
},


  button: {
    width: "60%",
    marginHorizontal: '20%',
    backgroundColor: '#fff',
    marginTop: '10%',
    marginBottom: "10%",
    borderRadius: 5,
    padding: '2%',
    paddingHorizontal: '2%',
  },
  buttontxt: {
    color: '#5cc3ff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});

export default BookDetails;
