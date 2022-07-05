import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput, Alert } from "react-native";
import StripeApp from "./StripeApp";
import firebase from "../database/firebase";
import { getAuth } from "firebase/auth";
import { useUserContext } from "../context/userContext";

const PayScreen = (props) => {

  const auth = getAuth();
  const user = auth.currentUser;
  const { setUser, getUser } = useUserContext();
  

  useEffect(() => {
    getUser();
    if (!user) {
      Alert.alert('Debe iniciar sesion para realizar una reservacion');
      props.navigation.navigate('Detalles')
    }
    
  }, []);


  console.log(props.route.params.amount)
  console.log(props.route.params.checkhold.cpers)
  return (

    <StripeApp amount={props.route.params.amount * 10}
      pers={props.route.params.checkhold.cpers}
      date1={props.route.params.checkhold.cdate1}
      date2={props.route.params.checkhold.cdate2}
      days={props.route.params.checkhold.ndays}
      postId={props.route.params.checkhold.postId}
      thumbnail={props.route.params.checkhold.thumbnail}
      titulo={props.route.params.checkhold.titulo}


      style={styles.center} />


  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
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
});

export default PayScreen;