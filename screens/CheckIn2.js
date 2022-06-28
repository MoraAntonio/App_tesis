import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Button, ActivityIndicator } from "react-native";

import firebase from "../database/firebase";
import StripeApp from "./StripeApp";

const CheckIn2 = (props) => {

    const [post, setPost] = useState('');
    const [loading, setLoading] = useState(true);

    const getPostById = async (id) => {
        const dbRef = firebase.db.collection("publicaciones").doc(id);
        const doc = await dbRef.get();
        const post = doc.data();
        setPost({ ...post, id: doc.id });
        setLoading(false);
        //console.log(post);
      };

      const cdate1 = props.route.params.checkhold.cdate1;
      const cdate2 = props.route.params.checkhold.cdate2;

      const tdifference = cdate2.getTime() 
      - cdate1.getTime();
  
      const days = tdifference / (1000 * 3600 * 24); 
      const thisDate = new Date();
      const amount1 = days * post.precio;
    
      const printd1 =
        cdate1.getDate() +
        "-" +
        (cdate1.getMonth() + 1) +
        "-" +
        cdate1.getFullYear();
      const printd2 =
        cdate2.getDate() +
        "-" +
        (cdate2.getMonth() + 1) +
        "-" +
        cdate2.getFullYear();
      

      useEffect(() => {
        getPostById(props.route.params.checkhold.postId);
      }, [props.route.params.checkhold]);


      if (loading) {
        return (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      } else {
  return (
       <View>
        <View style={styles.square}>
        <View style={styles.parWrapper}>
            <Text style={styles.par}>Primer dia:</Text>
            <Text style={styles.par}>{printd1}</Text>
          </View>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>Ultimo dia:</Text>
            <Text style={styles.par}>{printd2}</Text>
          </View>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>Personas a hospedarse:</Text>
            <Text style={styles.par}>{props.route.params.checkhold.cpers}</Text>
          </View>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>Precio/noche:</Text>
            <Text style={styles.par}>{post.precio}$</Text>
          </View>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>Cantidad de noches:</Text>
            <Text style={styles.par}>{days}</Text>
          </View>
          <View style={styles.parWrapper}>
            <Text style={styles.par}>Total a pagar:</Text>
            <Text style={styles.par}>{amount1}$</Text>
          </View>
          
        </View>

       <Button title={'pagar'} onPress={() => {
        console.log(amount1)
        props.navigation.navigate('Detalles de pago', {
          amount: amount1,
          checkhold: props.route.params.checkhold,
        })
      }}></Button>
        

       </View>

  
  )}
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

  square: {
    width: "100%",
    backgroundColor: "lightgray",
    color: "white",
    padding: 30,
    marginVertical: 20,
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

export default CheckIn2;