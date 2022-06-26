import { useEffect, useState } from "react";
import firebase from "../database/firebase";

// import all the components we are going to use
import { getAuth } from "firebase/auth";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PostCard from "../components/PostCard";
import { Button } from "react-native-elements";
import {PermissionsAndroid} from 'react-native';

import * as ImagePicker from "expo-image-picker";

const FAKE_IMAGES = [
  "https://a0.muscache.com/im/pictures/7b0190c7-3af2-4e3b-b3ed-24750a7f0314.jpg?im_w=1200",
  "https://a0.muscache.com/im/pictures/2f740368-6826-41fb-8a07-dea41f8e5132.jpg?im_w=720",
  "https://a0.muscache.com/im/pictures/bf0c34db-da8c-41a5-9f77-478019ce0bc9.jpg?im_w=720",
];
const SearchHome = ({ route, navigation }) => {
  const [search, setSearch] = useState("");
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

      console.log(posts[0]);
    });
  };

  const searchFilterFunction = (text) => {
    //Validacion si la barra de busqueda no esta en blanco
    if (text) {
      const newData = posts.filter(function (item) {
        // Aplicar filtro con el texto en la barra de busqueda
        const itemData = item.titulo
          ? item.titulo.toUpperCase()
          : "".toUpperCase();
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

  const gotocreate = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Debe ingresar usuario para realizar una publicacion");
    } else {
      navigation.navigate("Crear Publicacion", {
        username: user.displayName,
        userid: user.uid,
      });
    }
  };
// mover a creacion de posts y no aqui

async function cameraPermission() {
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  console.log({granted})
  if(granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true
  } else {
   return false
  }
}

  const uploadImage = async () => {
    console.log("INTENTANDO AGREGAR FOTO");
    const allowed = await cameraPermission()
  if (!allowed) {
    console.log("NO DIO PERMISO DE FOTO")
    return
  }
  console.log("SI DIO PERMISO DE FOTO")
try {

  const result = await ImagePicker.launchImageLibrary({ includeBase64: true });
  const selectedImage = result.assets[0];
  // selectedImage incluye una key llamada base64 que es lo que se guardara en firebase
  // selecedImage incluye una key llamada uri que es la que usara para hacer el preview en la creacion
  console.log(selectedImage);

}catch(error) {
console.log("HUBO UN ERROR" ,error)
}
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <View className={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
        <Button onPress={uploadImage} title="Upload Image" />
        {search !== "" && (
          <FlatList
            data={filteredDataSource}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PostCard
                heading={item.titulo}
                images={FAKE_IMAGES}
                subheading={item.precio}
                onPress={() =>
                  navigation.navigate("Detalles", {
                    postId: item.id,
                  })
                }
              />
            )}
          />
        )}
{search === "" && (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PostCard
                heading={item.titulo}
                images={FAKE_IMAGES}
                subheading={item.precio}
                onPress={() =>
                  navigation.navigate("Detalles", {
                    postId: item.id,
                  })
                }
              />
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.postbutton} onPress={gotocreate}>
        <Text style={styles.postbuttontext}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  main: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flatlist: {
    height: "100%",
    paddingBottom: 40,
  },

  button: {
    marginTop: "5%",
    backgroundColor: "#dedede",
    width: "50%",
    paddingVertical: "3%",
    borderRadius: 4,
  },
  buttontext: {
    textAlign: "center",
    color: "#ff00c8",
    fontWeight: "bold",
  },

  postbutton: {
    backgroundColor: "#4287f5",
    height: 60,
    width: 60,
    borderRadius: 30,
    bottom: "14%",
    right: "4%",
    position: "absolute",
    elevation: 4,
  },
  postbuttontext: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 40,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
  },
  Card: {
    backgroundColor: "#424242",
    width: "80%",
    alignSelf: "center",
    paddingHorizontal: "10%",
    paddingTop: "5%",
    paddingBottom: "15%",
    borderRadius: 15,
    borderWidth: 4,
    borderColor: "#ff00c8",
    elevation: 8,
    marginBottom: "10%",
    marginTop: "2%",
  },
  card_title: {
    fontSize: 22,
    marginBottom: "2%",
    color: "#fff",
    fontWeight: "bold",
  },
  card_desc: {
    fontSize: 15,
    marginBottom: "2%",
    color: "#fff",
  },
});

export default SearchHome;