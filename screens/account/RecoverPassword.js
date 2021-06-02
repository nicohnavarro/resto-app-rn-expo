import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../../components/Loading";
import { sendEmailResetPasword } from "../../utils/actions";
import { validateEmail } from "../../utils/helpers";

export default function RecoverPassword({ navigation }) {
  const [email, setEmail] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateData()) {
      return;
    }

    setLoading(true);
    const result = await sendEmailResetPasword(email);
    setLoading(false);
    if (!result.statusResponse) {
      Alert.alert("Error", "Este correo no esta relacionado a ningun usuario.");
      return;
    }
    Alert.alert(
      "Confirmacion",
      "Se ha enviado un correo con las instrucciones para cambiar tu clave."
    );
    navigation.navigate("account", { screen: "login" });
  };

  const validateData = () => {
    setErrorEmail(null);
    let valid = true;

    if (!validateEmail(email)) {
      setErrorEmail("Debes ingresar un correo valido.");
      valid = false;
    }

    return valid;
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Ingresa tu correo..."
        containerStyle={styles.inputForm}
        onChange={(e) => setEmail(e.nativeEvent.text)}
        defaultValue={email}
        errorMessage={errorEmail}
        keyboardType="email-address"
        rightIcon={
          <Icon type="material-community" name="at" iconStyle={styles.icon} />
        }
      />
      <Button
        title="Recuperar clave"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btnRecover}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Recuperando clave..." />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "90%",
  },
  btnContainer: {
    marginTop: 20,
    width: "85%",
    alignSelf: "center",
  },
  btnRecover: {
    backgroundColor: "#11270B",
  },
  icon: {
    color: "#71B340",
  },
});
