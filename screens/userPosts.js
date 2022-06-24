import React, { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const UserPosts = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firebase.db.collection("publicaciones").onSnapshot((querySnapshot) => {
      const posts = [];
      querySnapshot.docs.forEach((doc) => {
        const { titulo, precio, nombre_arrendador } = doc.data();
        posts.push({
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
      
      {posts.map((post) => {
        return (
          <ListItem
            key={post.id}
            bottomDivider
          >
            <ListItem.Chevron />
            
            <ListItem.Content>
              <ListItem.Title>{post.titulo}</ListItem.Title>
              <ListItem.Subtitle>{post.precio}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        );
      })}
    </ScrollView>
  );
};

export default UserPosts;
