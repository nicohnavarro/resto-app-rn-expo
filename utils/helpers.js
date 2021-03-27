import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import * as Location from "expo-location";
import { Alert } from "react-native";

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const loadImageFromGallery = async (array) => {
  const response = { status: false, image: null };
  const resultPermissions = await Permissions.askAsync(Permissions.CAMERA);
  if (resultPermissions.status === "denied") {
    Alert.alert("Debes darle permiso para acceder a las imagenes");
    return response;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: array,
  });

  if (result.cancelled) {
    return response;
  }
  response.status = true;
  response.image = result.uri;

  return response;
};

export const fileToBlog = async (path) => {
  const file = await fetch(path);
  const blob = await file.blob();
  return blob;
};

export const getCurrentLocation = async () => {
  const response = { status: false, location: null };
  const resultPermission = await Permissions.askAsync(Permissions.LOCATION);
  if (resultPermission.status === "denied") {
    Alert.alert("Debes dar permisos para tu ubicacion!");
    return response;
  }
  const position = await Location.getCurrentPositionAsync();
  const location = {
    latitud: position.coords.latitude,
    longitud: position.coords.longitude,
    latitudDelta: 0.001,
    longitudDelta: 0.001,
  };
  response.status = true;
  response.location = location;
  return response;
};
