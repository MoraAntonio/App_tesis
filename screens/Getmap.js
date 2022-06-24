import React, { useEffect, useState } from "react"
import { StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  } from "react-native"
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useMap } from '../functions/usemap';
import * as TaskManager from "expo-task-manager"
import * as Location from "expo-location"

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME"
let foregroundSubscription = null

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error)
    return
  }
  if (data) {
    // Extract location coordinates from data
    const { locations } = data
    const location = locations[0]
    if (location) {
      console.log("Location in background", location.coords)
    }
  }
})

export default function GetMap(props) {
  // Define position state: {latitude: number, longitude: number}
  const [position, setPosition] = useState({})
  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  });

  const {
    mapRef,
  } = useMap();

  // Request permissions right after starting the app
  useEffect(() => {

    startForegroundUpdate()
    
  }, [])

  const requestPermissions = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync()
    if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
  }

  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    requestPermissions()
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync()
    if (!granted) {
      console.log("location tracking denied")
      return
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove()

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      location => {
        setPosition(location.coords)
      }
    )
  }

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    foregroundSubscription?.remove()
    setPosition(null)
  }

  const goBackWithLocation = () => {
    stopForegroundUpdate();
    props.navigation.navigate('Crear Publicacion', {
    sharep: marker,  
    })
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        customMapStyle={styles.mapStyle}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        initialRegion={{
          latitude: position?.latitude,
          longitude: position?.longitude,
          latitudeDelta: 0.0100,
          longitudeDelta: 0.0100,
        }}
        onPress={ e => {
          setMarker(e.nativeEvent.coordinate)
          console.log(marker)
        }
      }>
      <Marker coordinate={marker}/> 
        
      </MapView>
      <TouchableOpacity style={styles.button} onPress={() => goBackWithLocation()}>
         <Text style={styles.buttontext} >Publicar</Text>
      </TouchableOpacity>
      
   
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  button: {
        backgroundColor: '#4287f5',
        height: '10%',
        width: '30%',
        borderRadius: 7,
        padding: '1%',
        top: "85%",
        left: "31%",
        position: 'absolute',
        elevation: 4,
      
  },
});