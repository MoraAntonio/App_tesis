import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { app } from "../database/firebase";
import { Image } from "react-native-elements";

export default function SignUpScreen({ route, navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const auth = getAuth(app);

  const goToSignup = () => {
    navigation.navigate("SignUp");
  };

  const register = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        const user = authUser.user;
        updateProfile(user, {
          displayName: fullname,
        })
          .then(
            () => console.log("Profile Updated!"),
            navigation.navigate("UserDetails")
          )
          .catch((error) => console.log(error.message));
      })
      .catch((error) => alert(error.message));
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
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            onChangeText={(text) => setFullname(text)}
            style={styles.input}
            placeholder="Nombre y apellido"
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

          <TouchableOpacity onPress={register} style={styles.button}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  label: {
    width: "80%",
    fontSize: 12,
    fontWeight: "400",
    color: "black",
    textAlign: "left",
  },
  scroll: {
    width: "100%",
    height: "100%",
  },
  login: {
    width: "100%",
    height: "100%",
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
  },
});