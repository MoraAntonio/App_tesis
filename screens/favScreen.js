import React from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput } from "react-native";

const FavScreen = ({navigation}) => {
  return (
      <View style={styles.center} >
        <Text> Favoritos</Text>
     
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
});

export default FavScreen;