import React from "react";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { Divider, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import LoginForm from "../../components/account/LoginForm";

export default function Login() {
  return (
    <ScrollView>
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <View style={styles.container}>
        <LoginForm />
        <CreateAccount />
      </View>
      <Divider style={styles.divider} />
    </ScrollView>
  );
}

function CreateAccount(props) {
  const navigation = useNavigation();

  return (
    <Text
      style={styles.register}
      onPress={() => navigation.navigate("register")}
    >
      Aun no tienes una cuenta?
      <Text style={styles.btnRegister}>&nbsp;Registrate</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: "100%",
    marginVertical: 40,

  },
  container: {
    marginHorizontal: 40,
  },
  divider: {
    margin: 40,
    backgroundColor: "#438282",
  },
  register: {
    marginTop: 30,
    marginHorizontal: 10,
    alignItems: "center",
  },
  btnRegister: {
    color: "#a3bf45",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#a3bf45",
    marginTop: 10,
    marginHorizontal: 20,
  },
});
