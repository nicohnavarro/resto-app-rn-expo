import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { validateEmail } from "../../utils/helpers";
import { loginWithEmailAndPassword } from "../../utils/actions";
import Loading from "../Loading";
import { isEmpty, result } from "lodash";

import * as GoogleSignIn from "expo-google-sign-in";
import * as firebase from "firebase";
import { Platform } from "react-native";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorClave, setErrorClave] = useState("");
  const [loading, setLoading] = useState(false);
  const navigator = useNavigation();

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  async function googleSignInAsync() {
    try {
      await GoogleSignIn.initAsync();
      if (Platform.OS === "android") {
        await GoogleSignIn.askForPlayServicesAsync();
      }
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        onSignIn(user);
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        Alert.alert(JSON.stringify(result));
        return { cancelled: true };
      }
    } catch (err) {
      setLoading(false);
      Alert.alert(err.message);
      return { error: true };
    }
  }

  function onSignIn(googleUser) {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        if (!isUserEqual(googleUser, firebaseUser)) {
          const credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.auth.idToken,
            googleUser.auth.accessToken
          );
          setLoading(true);
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(() => {
              setLoading(false);
            })
            .catch(function (error) {
              setLoading(false);
              Alert.alert(error.message);
            });
        } else {
          Alert.alert("Usuario ya esta logeado");
        }
      });
  }

  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      let providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
  }

  const login = async () => {
    if (!validateData()) {
      return;
    }
    setLoading(true);
    const result = await loginWithEmailAndPassword(
      formData.correo,
      formData.clave
    );
    setLoading(false);
    if (!result.statusResponse) {
      setErrorCorreo(result.error);
      return;
    }
    navigator.navigate("account");
  };

  const validateData = () => {
    setErrorCorreo("");
    setErrorClave("");
    let isValid = true;

    if (!validateEmail(formData.correo)) {
      setErrorCorreo("Debes ingresar un correo valido.");
      isValid = false;
    }

    if (isEmpty(formData.clave)) {
      setErrorClave("Debes ingresar una clave valida.");
      isValid = false;
    }

    return isValid;
  };

  return (
    <View style={styles.form}>
      <Input
        containerStyle={styles.input}
        placeholder="Ingrese su correo..."
        keyboardType="email-address"
        onChange={(e) => onChange(e, "correo")}
        errorMessage={errorCorreo}
        defaultValue={formData.correo}
      />
      <Input
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        placeholder="Ingrese su clave..."
        onChange={(e) => onChange(e, "clave")}
        rightIcon={
          <Icon
            onPress={() => setShowPassword(!showPassword)}
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
          />
        }
        errorMessage={errorClave}
        defaultValue={formData.clave}
      />
      <Button
        containerStyle={styles.btnLogin}
        buttonStyle={styles.btn}
        title="Ingresar"
        onPress={() => login()}
      />
      <Button
        containerStyle={styles.btnLogin}
        buttonStyle={styles.btnGoogle}
        title="Ingresar con google"
        onPress={googleSignInAsync}
        icon={
          <Icon
            type="material-community"
            name="google"
            marginRight={10}
            size={20}
            color="#fff"
          />
        }
      />
      <Loading isVisible={loading} text="Ingresando a tu cuenta..." />
    </View>
  );
}

const defaultFormValues = () => {
  return { correo: "", clave: "" };
};

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
  },
  input: {
    width: "100%",
  },
  btnLogin: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  btn: {
    backgroundColor: "#a3bf45",
  },
  icon: {
    color: "#c1c1c1",
  },
  btnGoogle: {
    backgroundColor: "#ea4335",
  },
});
