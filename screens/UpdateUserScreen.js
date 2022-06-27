
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

import {firebase, auth} from "../database/firebase";
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
      }).catch((error) => {
        // An error occurred
        console.log(error);
        // ...
      });
  }




  console.log(user)
  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#9E9E9E" />
  //     </View>
  //   );
  // }

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

      <View>
        <Button title="Update" onPress={() => updateUser()} color="#19AC52" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
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
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  btn: {
    marginBottom: 7,
  },
});

export default UpdateUserScreen;
