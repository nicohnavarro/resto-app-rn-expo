import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";

export default function RegisterForm() {
  return (
    <View style={styles.form}>
      <Input containerStyle={styles.input} placeholder="Ingrese su correo..." />
      <Input containerStyle={styles.input} password={true} secureTextEntry={true} placeholder="Ingrese su clave..." />
      <Input containerStyle={styles.input} password={true} secureTextEntry={true} placeholder="Confirme su clave..." />
      <Button containerStyle={styles.btnRegister} buttonStyle={styles.btn} title="Registar" />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
  },
  input: {
    width: "100%",
  },
  btnRegister:{
    marginTop: 20,
    width: "90%",
    alignSelf:"center"
  },
  btn:{
    backgroundColor: "#438282"
  }
});
