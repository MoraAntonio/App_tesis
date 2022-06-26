import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import firebase from "../database/firebase";
import { getAuth } from "firebase/auth";
import axios from 'axios';


//ADD localhost address of your server
const API_URL = "http://192.168.1.107:3000";


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
          alert("Payment Successful");
          console.log("Payment successful ");
        
        }
      }
    } catch (e) {
      console.log(e);
    }
    //3.Confirm the payment with the card details
  };

  return (
    <View style={styles.container}>
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
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
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
  input: {
    backgroundColor: "#efefefef",

    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});
