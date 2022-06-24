import React from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput } from "react-native";
import firebase from "firebase/compat";



//completar esto
const FavScreen = ({navigation}) => {

    const user = firebase.auth().currentUser;
    const fcreacion = Date(user.createdAt);



    


  return (
      <View style={styles.center} >
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Nombre Completo"
            multiline={false}
            numberOfLines={1}
            onChangeText={(value) => handleChangeText(value, "titulo")}
            value={user.displayName}
          />
        </View>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Descripcion"
          multiline={true}
          numberOfLines={1}
          onChangeText={(value) => handleChangeText(value, "descripcion")}
          value={user.email}
        />
      </View>
    
    </View>

  
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  inputGroup: {
    borderWidth: 1,
    width: "80%",
    height: 50,
    marginBottom: 50,
    marginTop: '1%',
    backgroundColor: '#eeeeee',
    paddingLeft: 5,
    paddingTop: '1%',
    borderRadius: 8,
  },
});

export default FavScreen;