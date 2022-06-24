import React, { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const BookIndex = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firebase.db.collection("users").onSnapshot((querySnapshot) => {
      const posts = [];
      querySnapshot.docs.forEach((doc) => {
        const { titulo, precio, nombre_arrendador } = doc.data();
        users.push({
          id: doc.id,
          titulo,
          precio,
          nombre_arrendador
        });
      });
      setPosts(posts);
    });
  }, []);

  return (
    <ScrollView>
      
      {users.map((user) => {
        return (
          <ListItem
            key={user.id}
            bottomDivider
            onPress={() => {
              props.navigation.navigate("UserDetailScreen", {
                userId: user.id,
              });
            }}
          >
            <ListItem.Chevron />
            
            <ListItem.Content>
              <ListItem.Title>{posts.titulo}</ListItem.Title>
              <ListItem.Subtitle>{posts.precio}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        );
      })}
    </ScrollView>
  );
};

export default BookIndex;
