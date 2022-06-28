import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Button } from "react-native";

import firebase from "../database/firebase";
import StripeApp from "./StripeApp";

const CheckIn2 = (props) => {

    const [post, setPost] = useState('');

    const getPostById = async (id) => {
        const dbRef = firebase.db.collection("publicaciones").doc(id);
        const doc = await dbRef.get();
        const post = doc.data();
        setPost({ ...post, id: doc.id });
        //console.log(post);
      };

      const tdifference = props.route.params.checkhold.cdate2.getTime() 
      - props.route.params.checkhold.cdate1.getTime();
  
      const days = tdifference / (1000 * 3600 * 24); 
      const thisDate = new Date();
      const amount1 = days * post.precio;

      const saveCheck = async () => {

        try {
          await firebase.db.collection("reservaciones").add({
            fecha_inicio: date1,
            fecha_fin: date2,
            fecha_creacion: new Date(),
            id_huesped: user.uid,
            nombre_huesped: user.displayName,
            id_publicacion: post.id,
            cantidad_personas: '',
            thumbnail: post.images[0],
        });
        props.navigation.navigate('PDetails', {
          postId: post.id,
        })
            
          } catch (error) {
            console.log(error)
          }

    };

      useEffect(() => {
        getPostById(props.route.params.checkhold.postId);
      }, [props.route.params.checkhold]);

  return (
       <View>
      <Text>{post.id}</Text>
       <Text>{post.precio}$ x {days}</Text>
       <Text>{amount1}$</Text>

       <Button title={'pagar'} onPress={() => {
        console.log(amount1)
        props.navigation.navigate('Detalles de pago', {
          amount: amount1,
          checkhold: props.route.params.checkhold,
        })
      }}></Button>
        

       </View>

  
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 100,
  },
});

export default CheckIn2;