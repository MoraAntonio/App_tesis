import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput } from "react-native";

import firebase from "../database/firebase";

const CheckIn2 = (props) => {

    const [post, setPost] = useState('');

    const getPostById = async (id) => {
        const dbRef = firebase.db.collection("publicaciones").doc(id);
        const doc = await dbRef.get();
        const post = doc.data();
        setPost({ ...post, id: doc.id });
        console.log(post);
      };

      const tdifference = props.route.params.checkhold.cdate2.getTime() 
      - props.route.params.checkhold.cdate1.getTime();
  
      const days = tdifference / (1000 * 3600 * 24); 
      const thisDate = new Date();
      const amount = days * post.precio;

      useEffect(() => {
        getPostById(props.route.params.checkhold.postId);
      }, [props.route.params.checkhold]);

  return (
      <View style={styles.center} >
        <Text>{post.id}</Text>
        <Text>{post.precio}$ x {days}</Text>
        <Text>{amount}$</Text>
     
      </View>

  
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

export default CheckIn2;