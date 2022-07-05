
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { getAuth, updateProfile } from "firebase/auth";
import { useUserContext } from "../context/userContext";


const UpdateUserScreen = (props) => {
  const {user, getUser,setUser} = useUserContext();

  const [loading, setLoading] = useState(true);

  const handleTextChange = (value, prop) => {
    setUser({ ...user, [prop]: value });
  };

  const updateUser = async () => {
    // const update = {
    //   displayName: user.displayName,
    //   email: user.email
    // };
    // await  auth().currentUser.updateProfile(update);
    const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: user.displayName,
      }).then(() => {
        // Profile updated!
        // ...
        console.log('update successful')
        Alert.alert('Usuario actualizado!')
        getUser();
        props.navigation.goBack();
      }).catch((error) => {
        // An error occurred
        console.log(error);
        // ...
      });
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <TextInput
          placeholder="Name"
          style={styles.inputGroup}
          value={user?.displayName}
          onChangeText={(value) => handleTextChange(value, "displayName")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Email"
          style={styles.inputGroup}
          value={user?.email}
          onChangeText={(value) => handleTextChange(value, "email")}
        />
      </View>

      <TouchableOpacity onPress={() => updateUser()} style={styles.button}>
            <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => logout()} style={styles.button2}>
            <Text style={styles.buttonText}>Eliminar Usuario</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: '#e6e6e6',
    alignContents: 'center',
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    borderWidth: 1,
    borderColor: "#f2f2f2",
    width: "100%",
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
    width: "100%",
    marginVertical: "2%",
    borderRadius: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: "#00CFEB",
    elevation: 3,
  },
  button2: {
    width: "100%",
    marginVertical: "2%",
    borderRadius: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: "#c9140a",
    elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    paddingVertical: "4%",
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
});

export default UpdateUserScreen;
