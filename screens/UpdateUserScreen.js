import React from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput, ScrollView, Button } from "react-native";
import { getAuth } from "firebase/auth";

const UpdateUserScreen = (props) => {

  const auth = getAuth();
  const user = auth.currentUser;

  const updateUser = async () => {
    const userRef = firebase.db.collection("users").doc(user.id);
    await userRef.set({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setUser(initialState);
    props.navigation.navigate("UsersList");
  };


  return (
    <ScrollView style={styles.container}>
    <View>
      <TextInput
        placeholder="Name"
        autoCompleteType="username"
        style={styles.input}
        value={user.name}
        onChangeText={(value) => handleTextChange(value, "name")}
      />
    </View>
    <View>
      <TextInput
        autoCompleteType="email"
        placeholder="Email"
        style={styles.input}
        value={user.email}
        onChangeText={(value) => handleTextChange(value, "email")}
      />
    </View>


      <Button title="Update" onPress={() => updateUser()} color="#19AC52" />
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    resizeMode: 'cover',
  },
  input: {
    borderWidth: 1,
    width: "80%",
    height: "40%",
    marginBottom: "5%",
    backgroundColor: '#eeeeee',
    paddingLeft: 5,
    borderRadius: 8,
  },
});

export default UpdateUserScreen;