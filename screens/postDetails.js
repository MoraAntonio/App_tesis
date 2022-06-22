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

//mapa
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useMap } from "../functions/usemap";

import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from "../database/firebase";
import { AuthErrorCodes, getAdditionalUserInfo, getAuth } from "firebase/auth";
import { Marker } from "react-native-maps";

//custom components
import ItemDivider from "../components/ItemDivider";



const PostDetails = (props) => {

  //estado inicial
  const initialState = {
    titulo: '',
    descripcion: '',
    precio: '',
    fecha_inicio: '',
    fecha_fin: '',
    fecha_publicacion: '',
    id_arrendador: '',
    nombre_arrendador: '',
    id_chat: '',
  };

  const [post, setPost] = useState(initialState);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  //obtener usuario
  const getUser = () => {
    
    const auth = getAuth();
    const cuser = auth.currentUser;
    setUser(cuser);
  }

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
    
    console.log(post);
  };

  const finicio = post.fecha_inicio;
  const ffinal  = post.fecha_fin;
  const fpublic = post.fecha_publicacion;

  const finicio2 = new Date(finicio.seconds*1000);
  const ffinal2  = new Date(ffinal.seconds*1000);
  const fpublic2 = new Date(fpublic.seconds*1000);

  const printd1 = finicio2.getDate() + '-' + (finicio2.getMonth()+1) + '-' + finicio2.getFullYear();
  const printd2 = ffinal2.getDate() + '-' + (ffinal2.getMonth()+1) + '-' + ffinal2.getFullYear();
  const printd3 = fpublic2.getDate() + '-' + (fpublic2.getMonth()+1) + '-' + fpublic2.getFullYear();

  //cargar al iniciar
  useEffect(() => {
    getUser();
    getPostById(props.route.params.postId);
  }, []);

  if (user){
  if (user.uid == post.id_arrendador) {

    return (
      <ScrollView style={styles.container}>
        <View style={styles.square}>
          <Text style={styles.title}>{post.titulo}</Text>

          <Text style={styles.desc}>Descripcion</Text>
          <ItemDivider/>
          <Text style={styles.desc2}>{post.descripcion}</Text>
          <ItemDivider/>
          <Text style={styles.par}>Precio/noche: {post.precio}$</Text>
          <Text style={styles.par}>Fecha inicio: {printd1}</Text>
          <Text style={styles.par}>Fecha de cierre: {printd2}</Text>
          <Text style={styles.par}>Fecha de publicacion: {printd3}</Text>
          <Text style={styles.par}>Arrendador: {post.nombre_arrendador}</Text>


          



              <TouchableOpacity style={styles.button} onPress={() => {props.navigation.navigate('Editar', {
              postId: post.id 
            })}}>
              <Text style={styles.buttontxt} >Editar</Text>
              </TouchableOpacity>
          
        </View>
      </ScrollView>

    )
  }
  else {

    return (
      <ScrollView style={styles.container}>
        <View style={styles.square}>
          <Text style={styles.title}>{post.titulo}</Text>
          <Text style={styles.desc}>Descripcion</Text>
          <Text style={styles.desc2}>{post.descripcion}</Text>
          <Text style={styles.par}>Precio/noche: {post.precio}$</Text>
          <Text style={styles.par}>Fecha inicio: {printd1}</Text>
          <Text style={styles.par}>Fecha de cierre: {printd2}</Text>
          <Text style={styles.par}>Fecha de publicacion: {printd3}</Text>
          <Text style={styles.par}>Arrendador: {post.nombre_arrendador}</Text>

     

              <TouchableOpacity style={styles.button} onPress={() => {props.navigation.navigate('Reservar', {
              postId: post.id 
            })}}>
              <Text style={styles.buttontxt} >Reservar</Text>
              </TouchableOpacity> 
        </View>
      </ScrollView>

    )

  }
}
  else {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.square}>
          <Text style={styles.title}>{post.titulo}</Text>
          <Text style={styles.desc}>Descripcion</Text>
          <Text style={styles.desc2}>{post.descripcion}</Text>
          <ItemDivider/>
          <Text style={styles.par}>Precio/noche: {post.precio}$</Text>
          <ItemDivider/>
          <Text style={styles.par}>Fecha inicio: {printd1}</Text>
          <ItemDivider/>
          <Text style={styles.par}>Fecha de cierre: {printd2}</Text>
          <ItemDivider/>
          <Text style={styles.par}>Fecha de publicacion: {printd3}</Text>
          <ItemDivider/>
          <Text style={styles.par}>Arrendador: {post.nombre_arrendador}</Text>
          <ItemDivider/>

          <MapView
                region={'Africa'}
            />

              <TouchableOpacity style={styles.button} onPress={() => {props.navigation.navigate('Reservar', {
              postId: post.id 
            })}}>
              <Text style={styles.buttontxt} >Reservar</Text>
              </TouchableOpacity>

        </View>
      </ScrollView>

    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '50%',
  },
  mapStyle: {
    width: '100%',
    height: '35%',
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

export default PostDetails;
