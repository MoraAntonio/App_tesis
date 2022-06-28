import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import firebase from "../database/firebase";
import { getAuth } from "firebase/auth";
import axios from 'axios';


//ADD localhost address of your server
// const API_URL = "http://192.168.1.107:3000";
const API_URL = "https://stripe-tesis-test.herokuapp.com";


const StripeApp = props => {

  const auth = getAuth();
  const user = auth.currentUser;

  const [email, setEmail] = useState();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  console.log(props);

  const saveCheck = async () => {

    console.log(props)

    try {
      await firebase.db.collection("reservaciones").add({
        fecha_inicio: props.date1,
        fecha_fin: props.date2,
        fecha_creacion: new Date(),
        id_huesped: user.uid,
        nombre_huesped: user.displayName,
        id_publicacion: props.postId,
        cantidad_personas: props.pers,
        total: props.amount,
        thumbnail: props.thumbnail,
        estado_pago: 'aprobado',
    });
    console.log('reservacion creada');
        
      } catch (error) {
        console.log(error)
      }

};

  const fetchPaymentIntentClientSecret = async (amount) => {
    console.log({amount})
    const response = await axios.post(`${API_URL}/create-payment-intent`, { amount })
    const { clientSecret, error } = await response.data;
    return { clientSecret, error };
  };

  const handlePayPress = async () => {
    //1.Gather the customer's billing information (e.g., email)
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please enter Complete card details and Email");
      return;
    }
    const billingDetails = {
      email: email,
    };
    //2.Fetch the intent client secret from the backend
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret(props.amount)
      console.log(clientSecret, error);
      //2. confirm the payment
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails: billingDetails,
        });
        
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          saveCheck();
          alert("Pago exisoto!");
          console.log("Pago exitoso!");
        
        }
      }
    } catch (e) {
      console.log(e);
    }
    //3.Confirm the payment with the card details
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pago por tarjeta</Text>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={value => setEmail(value.nativeEvent.text)}
        style={styles.input}
      />
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={cardDetails => {
          setCardDetails(cardDetails);
        }}
      />
      <Button onPress={handlePayPress} title="Pagar" disabled={loading} />
    </View>
  );
};
export default StripeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
  },
  title: {
    fontSize: 20,
    marginVertical: '4%',
    textAlign: 'center',
  },
  input: {
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
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
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
});
