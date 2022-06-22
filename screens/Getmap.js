import React, {useState} from 'react';
import { StyleSheet,
     View,
     Dimensions,
    TouchableOpacity,
    Text,
    } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useMap } from '../functions/usemap';



export default function GetMap() {

    const [marker, setMarker] = useState({
        
            latitude: 0,
            longitude: 0,
        
        }
    );

  const {
    mapRef,
  } = useMap();

  return (
    <View style={styles.container}>

            <MapView
        ref={mapRef}
        customMapStyle={styles.mapStyle}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        initialRegion={{
          latitude: 10.716228,
          longitude: -71.607530,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        onPress={ e => {
           
            setMarker(e.nativeEvent.coordinate)
            console.log(marker)

            }
        }>
        <Marker coordinate={marker}/>    
        
      </MapView>
              <TouchableOpacity styles={styles.confirmbt}>
            <Text></Text>
        </TouchableOpacity>
    </View>

    
  );
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
  confirmbt: {
    postbutton: {
        backgroundColor: '#4287f5',
        height: 60,
        width: 60,
        borderRadius: 30,
        top: "650%",
        left: "75%",
        position: 'absolute',
        elevation: 4,
      },
  },
});