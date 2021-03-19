import React from "react";
import { ScrollView, StyleSheet, Text, View, Image} from "react-native";
import { Divider, Button } from "react-native-elements";

export default function Login() {
  return (
    <ScrollView>
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <View style={styles.container}>
        <Text>Usuario:</Text>
        <Text>Contrasena:</Text>
      </View>
      <Button
                title="Ingresar"
                buttonStyle={styles.button}
                onPress={()=>console.log("login")}
            />
      <Divider style={styles.divider} />
      <CreateAccount />
    </ScrollView>
  );
}

function CreateAccount(props) {
  return (
    <Text style={styles.register} onPress={() => console.log("registrar")}>
      Aun no tienes una cuenta?
      <Text style={styles.btnRegister}>Registrate</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: "100%",
    marginBottom: 20,
  },
  container: {
    marginHorizontal: 40,
  },
  divider: {
    margin: 40,
    backgroundColor: "#438282",
  },
  register: {
    marginTop: 15,
    marginHorizontal: 10,
    alignItems: "center",
  },
  btnRegister: {
    color: "#a3bf45",
    fontWeight: "bold",
  },
  button : {
    backgroundColor: "#a3bf45",
    marginTop: 10,
    marginHorizontal:20
}
});
