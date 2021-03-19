import React from "react";
import { StyleSheet, Image } from "react-native";
import RegisterForm from "../../components/account/RegisterForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register() {
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <RegisterForm></RegisterForm>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        textAlign:"center",
        justifyContent:"center",
        marginTop:10
    },
    image: {
        height: 150,
        width: "100%",
        marginBottom: 20,
      },
});
