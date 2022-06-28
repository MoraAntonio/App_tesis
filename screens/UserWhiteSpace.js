import React, {useEffect} from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput, ActivityIndicator } from "react-native";
import { useUserContext } from "../context/userContext";

const WhiteSpace = ({navigation}) => {

  const {user, setUser, getUser} = useUserContext();

    useEffect(() => {
        getUser();
        if (user.uid) {
          navigation.navigate('UserDetails');
        } else {
            navigation.navigate('Login'); 
        }
      }, []);

  return (
      <View style={styles.center} >
        <ActivityIndicator size="large" color="#9E9E9E" />
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

export default WhiteSpace;