import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";

export default function Favorites({ navigation }) {
  return (
    <View style={styles.mapview}>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <Text>Cargando</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapview:{
    width: '100%'
  }
});
