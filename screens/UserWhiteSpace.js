import React, {useEffect} from "react";
import { View, StyleSheet, Text, SafeAreaView, TextInput } from "react-native";
import { useUserContext } from "../context/userContext";

const WhiteSpace = ({navigation}) => {

  const {user, setUser, getUser} = useUserContext();

    useEffect(() => {
        getUser();
        if (user) {
          navigation.navigate('UserDetails');
        } else {
            navigation.navigate('Login'); 
        }
      }, []);

  return (
      <View style={styles.center} >
     
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