import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View, ActivityIndicator, Text, Image } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../database/firebase";
import { getAuth } from "firebase/auth";
import { TouchableOpacity } from "react-native-web";
import { useUserContext } from "../context/userContext";


const BookIndex = (props) => {

  const {user, getUser} = useUserContext();
  const userid = user.uid;
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [books, setBooks] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const getPosts = () => {
      firebase.db.collection("publicaciones").onSnapshot((querySnapshot) => {
        const posts = [];
        querySnapshot.docs.forEach((doc) => {
          const { titulo, precio, descripcion, id_arrendador, images, nombre_arrendador } = doc.data();
          posts.push({
            id: doc.id,
            titulo,
            precio,
            descripcion,  
            id_arrendador,
            images,
            nombre_arrendador,
          });
        });
        setPosts(posts);
      });
    }

      const getBooks = () => {
        firebase.db.collection("reservaciones").onSnapshot((querySnapshot) => {
          const books = [];
          querySnapshot.docs.forEach((doc) => {
            const { titulo_p, id_huesped, id_publicacion, thumbnail, fecha_inicio, fecha_final, total } = doc.data();
            books.push({
              id: doc.id,
              titulo_p,
              id_huesped,
              id_publicacion,
              thumbnail,
              fecha_inicio,
              fecha_final,
              total,
            });
          });
          setBooks(books);
        });
        setLoading(false);
      }

      useEffect(() => {
        getUser();
        if (userid && books.length > 0) {
          searchFilterFunction(userid)
        } else {
          setLoading(false)
        }
      }, [books, userid])
    
      useEffect(() => {
        getUser();
        if (userid) {
        getBooks();
        } else {
          setLoading(false)
        }
      }, [userid]);

      useEffect(() => {
        if (userid) {
        getPosts();
        } else {
          setLoading(false)
        }
      }, [userid]);
    
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

   


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  } else if (!userid) {
    return(
      <View style={styles.center}>
        
        <Text style={{fontSize: 15, color: 'red'}}> Inicie sesion para ver sus reservaciones </Text>
      </View>
    )
  } else {



    return (
      <ScrollView>
        {filteredDataSource.map((book) => {
          return (
            <ListItem
              key={book.id}
              bottomDivider
              onPress={() => {
                  props.navigation.navigate("BookDetails", {
                    bookId: book.id,
                  })
              }}
            >
              <ListItem.Chevron />
              <ListItem.Content>
              <View style={styles.listview}>
                <Image  style={styles.image} source={{ uri: `data:image/png;base64,${book?.thumbnail ||  "https://a0.muscache.com/im/pictures/7b0190c7-3af2-4e3b-b3ed-24750a7f0314.jpg?im_w=1200"}` }} />
                <ListItem.Title style={styles.listview2}>{book?.titulo}</ListItem.Title>
                <ListItem.Title style={styles.listview2}>${book.total}</ListItem.Title>
                
              </View>
              <View>
              
              
              </View>
  
                
              </ListItem.Content>
            </ListItem>
          );
        })}
      </ScrollView>
    );
  }
};

export default BookIndex;

const styles = StyleSheet.create({
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  listview: {
    flex: 1,
    flexDirection: 'row',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  listview2: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: '5%',
  },
  image: {
    width: 50,
    height: 50,
  }
})