import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from "firebase/compat";
import { Image } from "react-native-elements";
import { app } from "../database/firebase";
import { useUserContext } from "../context/userContext";

export default function LoginScreen({ route, navigation }) {
  //estados
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState("");
  const auth = getAuth(app);
  const {user, getUser} = useUserContext();

  //ir a pantalla de registro de usuario
  const goToSignup = () => {
    navigation.navigate("SignUp");
  };

  //Funcion de login

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((currentUser) => {
        console.log("Signed in!");
        setCurrentUser(firebase.auth().currentUser);
        getUser();
        navigation.navigate("UserDetails");
      })
      .catch((error) => {
        alert(error);
      });
  };
return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.login}>
          <Image
            style={styles.image}
            source={{
              uri: "https://cdn.logo.com/hotlink-ok/logo-social.png",
            }}
          />
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            placeholder="ejemplo@ejemplo.com"
          />

          <Text style={styles.label}>Clave</Text>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            placeholder="Clave"
            secureTextEntry={true}
          />

          <TouchableOpacity onPress={handleSignIn} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToSignup} style={styles.registerWrapper}>
            <Text>
              ¿No tienes una cuenta?{" "}
              <Text style={styles.registerButton}>Registrate!</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  label: {
    width: "80%",
    fontSize: 12,
    fontWeight: "400",
    color: "black",
    textAlign: "left",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  scroll: {
    width: "100%",
    height: "100%",
  },

  login: {
    borderWidth: 0,
    width: "100%",
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#f2f2f2",
    width: "80%",
    height: 50,
    marginBottom: "5%",
    marginTop: "1%",
    backgroundColor: "#FFFFFF",
    paddingLeft: 10,
    borderRadius: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    width: "80%",
    marginVertical: "2%",
    borderRadius: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: "#00CFEB",
  },
  buttonText: {
    textAlign: "center",
    paddingVertical: "4%",
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  registerWrapper: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
  registerButton: {
    textAlign: "center",
    paddingVertical: "4%",
    fontSize: 15,
    color: "#00CFEB",
    fontWeight: "bold",
  },
});