import React, { useState, useEffect } from 'react';
import firebase from '../database/firebase';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

 // import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { getAuth } from 'firebase/auth';


const SearchHome = ({ route, navigation }) => {
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

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <View key={item.id} style={styles.Card}>
        <Text style={styles.card_title}>{item.titulo}</Text>
        <Text style={styles.card_desc}>{item.descripcion}</Text>
       
          <TouchableOpacity style={styles.button} onPress={() => {
            navigation.navigate('Detalles', {
            postId: item.id,
          })}}>
            <Text style={styles.buttontext} >Abrir</Text>
            </TouchableOpacity> 
      </View>
    );
  }

  const gotocreate = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert('Debe ingresar usuario para realizar una publicacion')
    } else {
      navigation.navigate('Crear Publicacion', {
        username: user.displayName,
        userid: user.uid,
      })
    }
  }


if (search !== "") {

  return (
    <SafeAreaView style={styles.main}>
      
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
          
      </View>
      <FlatList
          style={styles.flatlist}
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}
        />
        <TouchableOpacity style={styles.postbutton} onPress={gotocreate}>
            <Text style={styles.postbuttontext}>+</Text>  
          </TouchableOpacity>

    </SafeAreaView>
  );

  } else {

    return (
      <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Busque Aqui"
      />
      <FlatList
          style={styles.flatlist}
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}
        />
      <TouchableOpacity style={styles.postbutton} onPress={gotocreate}>
            <Text style={styles.postbuttontext}>+</Text>  
          </TouchableOpacity>
     
      </View>
    </SafeAreaView>
    )

  }

};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#212121'
  },
  container: {
    backgroundColor: '#212121',
  },
  flatlist: {
    height: "100%",
    paddingBottom: 40,
  },

  button: {
    marginTop: '5%',
    backgroundColor: '#ffffff',
    width: "50%",
    paddingVertical: '3%',
  },
  buttontext: {
    textAlign: 'center',
    color: '#5cc3ff',
    fontWeight: 'bold',
  },
 
  postbutton: {
    backgroundColor: '#4287f5',
    height: 60,
    width: 60,
    borderRadius: 30,
    top: "650%",
    left: "75%",
    position: 'absolute',
    elevation: 4,
  },
  postbuttontext: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 40,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
  },
  Card: {
    backgroundColor: '#5cc3ff',
    width: "80%",
    alignSelf: 'center',
    paddingHorizontal: "10%",
    paddingTop: '5%',
    paddingBottom: '15%',
    borderRadius: 20,
    elevation: 8,
    marginBottom: "10%",
    marginTop: "2%",
  },
  card_title: {
    fontSize: 22,
    marginBottom: '2%',
    color: '#fff',
    fontWeight: 'bold',
  }, 
  card_desc: {
    fontSize: 15,
    marginBottom: '2%',
    color: '#fff',
  },
});


export default SearchHome;