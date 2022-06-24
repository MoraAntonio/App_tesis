import React, { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../database/firebase";
import { getAuth } from "firebase/auth";
import { TouchableOpacity } from "react-native-web";


const UserPosts = (props) => {

    const auth = getAuth();
    const user = auth.currentUser;
    const userid = user.uid;

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [posts, setPosts] = useState([]);
  
    const getPosts = () => {
        firebase.db.collection("publicaciones").onSnapshot((querySnapshot) => {
          const posts = [];
          querySnapshot.docs.forEach((doc) => {
            const { titulo, precio, descripcion } = doc.data();
            posts.push({
              id: doc.id,
              titulo,
              precio,
              descripcion,  
            });
          });
          setPosts(posts);
          
        });
      }
    
    
    
      useEffect(() => {
        getPosts();
      }, []);
    
      const searchFilterFunction = (text) => {
        //Validacion si la barra de busqueda no esta en blanco
        if (text) {
          const newData = posts.filter(function (item) {
            // Aplicar filtro con el texto en la barra de busqueda
            const itemData = item.titulo
              ? item.titulo.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          //crear cartas para todas las publicaciones
          getPosts();
          setFilteredDataSource(posts);
          setSearch(text);
        }
      };

  return (
    <ScrollView>
      
      {posts.map((post) => {
        return (
          <ListItem
            key={post.id}
            bottomDivider
            onPress={() => {
                props.navigation.navigate("Detalles", {
                  postId: post.id,
                })
            }}
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
