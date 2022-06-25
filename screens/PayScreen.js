import React from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput } from "react-native";
import StripeApp from "./StripeApp";
import firebase from "../database/firebase";

const PayScreen = (props) => {
  console.log(props.route.params.amount)
  console.log(props.route.params.checkhold.cpers)
  return (
    
    <StripeApp amount={props.route.params.amount * 10} 
    pers={props.route.params.checkhold.cpers}
    date1={props.route.params.checkhold.cdate1}
    date2={props.route.params.checkhold.cdate2}
    days={props.route.params.checkhold.ndays}
    postId={props.route.params.checkhold.postId}
    
    style={styles.center}/>

  
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default PayScreen;