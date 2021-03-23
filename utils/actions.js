import { firebaseApp } from "./firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import { fileToBlog } from "./helpers";

const db = firebase.firestore(firebaseApp);

export const isUserLogged = () => {
  let isLogged = false;
  firebase.auth().onAuthStateChanged((user) => {
    user !== null && (isLogged = true);
  });
  return isLogged;
};

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};

export const closeSession = () => {
  return firebase.auth().signOut();
};

export const registerUser = async (correo, clave) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().createUserWithEmailAndPassword(correo, clave);
  } catch (error) {
    console.info(error);
    result.statusResponse = false;
    result.error = "Este correo ya fue registrado.";
  }
  return result;
};

export const loginWithEmailAndPassword = async (correo, clave) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().signInWithEmailAndPassword(correo, clave);
  } catch (error) {
    console.info(error);
    result.statusResponse = false;
    result.error = "Usuario o clave invalida";
  }
  return result;
};

export const uploadImage = async (image, path, name) => {
  const result = { statusResponse: false, error: null, url: null };
  const ref = firebase.storage().ref(path).child(name);
  const blob = await fileToBlog(image);
  try {
    await ref.put(blob);
    const url = await firebase
      .storage()
      .ref(`${path}/${name}`)
      .getDownloadURL();
    result.statusResponse = true;
    result.url = url;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const updateProfile = async (data) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().currentUser.updateProfile(data);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
