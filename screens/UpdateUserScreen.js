import React from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput, ScrollView } from "react-native";

const UpdateUserScreen = (props) => {

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
        style={styles.inputGroup}
        value={user.name}
        onChangeText={(value) => handleTextChange(value, "name")}
      />
    </View>
    <View>
      <TextInput
        autoCompleteType="email"
        placeholder="Email"
        style={styles.inputGroup}
        value={user.email}
        onChangeText={(value) => handleTextChange(value, "email")}
      />
    </View>
    <View>
      <TextInput
        placeholder="Phone"
        autoCompleteType="tel"
        style={styles.inputGroup}
        value={user.phone}
        onChangeText={(value) => handleTextChange(value, "phone")}
      />
    </View>
    <View style={styles.btn}>
      <Button
        title="Delete"
        onPress={() => openConfirmationAlert()}
        color="#E37399"
      />
    </View>
    <View>
      <Button title="Update" onPress={() => updateUser()} color="#19AC52" />
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default UpdateUserScreen;