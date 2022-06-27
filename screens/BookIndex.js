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
    const [books, setBooks] = useState([]);
  
    const getPosts = () => {
        firebase.db.collection("reservaciones").onSnapshot((querySnapshot) => {
          const books = [];
          querySnapshot.docs.forEach((doc) => {
            const { id_huesped, id_publicacion } = doc.data();
            books.push({
              id: doc.id,
              id_huesped,
              id_publicacion,
            });
          });
          setBooks(books);
        });
      }
      useEffect(() => {
        if (userid && books.length > 0) {
          searchFilterFunction(userid)
        }
      }, [books, userid])
    
      useEffect(() => {
        getPosts();
      }, []);
    
      const searchFilterFunction = (userid) => {
        //Validacion si la barra de busqueda no esta en blanco
        if (userid) {
          console.log("-----------------------")
          console.log(books.length)
          console.log({userid, books:books.map(p=>p.id_huesped)});
          const _newData = books.filter((item ) => item.id_huesped?.toLowerCase() === userid.toLowerCase())
          console.log("MIS ARRIENDOS", _newData.length)
          // const newData = posts.filter(function (item) {
          //   // Aplicar filtro con el texto en la barra de busqueda
          //   const itemData = item.id_arrendador
          //   const textData = userid;
          //   return itemData.indexOf(textData) > -1;
          // });
          setFilteredDataSource(_newData);
          setSearch(userid);
        } else {
          //crear cartas para todas las publicaciones
          getPosts();
          setFilteredDataSource(posts);
          setSearch(id_huesped);
        }
      };

  return (
    <ScrollView>
      {filteredDataSource.map((book) => {
        return (
          <ListItem
            key={book.id}
            bottomDivider
            onPress={() => {
                props.navigation.navigate("Detalles de Reservacion", {
                  bookId: book.id,
                })
            }}
          >
            <ListItem.Chevron />
            <ListItem.Content>
              <ListItem.Title>{book.id_huesped}</ListItem.Title>
              <ListItem.Subtitle>{book.precio}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        );
      })}
    </ScrollView>
  );
};

export default UserPosts;
