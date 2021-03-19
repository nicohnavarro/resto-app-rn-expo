import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { size } from "lodash";

import { validateEmail } from "../../utils/helpers";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorClave, setErrorClave] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const register = () => {
    if (!validateData()) {
      return console.log("nop");
    }

    console.log("yh");
  };

  const validateData = () => {
    setErrorCorreo("");
    setErrorClave("");
    setErrorConfirm("");
    let isValid = true;

    if (!validateEmail(formData.correo)) {
      setErrorCorreo("Debes ingresar un correo valido.");
      isValid = false;
    }

    if (size(formData.clave) < 6) {
      setErrorClave("Debes ingresar una clave mayor a 6 caracteres.");
      isValid = false;
    }

    if (formData.clave !== formData.confirm) {
      setErrorClave("Las claves deben ser iguales");
      setErrorConfirm("Las claves deben ser iguales");
      isValid = false;
    }

    return isValid;
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
      <Input
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        placeholder="Confirme su clave..."
        onChange={(e) => onChange(e, "confirm")}
        rightIcon={
          <Icon
            onPress={handleShowPassword}
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
          />
        }
        errorMessage={errorConfirm}
        defaultValue={formData.confirm}
      />
      <Button
        containerStyle={styles.btnRegister}
        buttonStyle={styles.btn}
        title="Registar"
        onPress={() => register()}
      />
    </View>
  );
}

const defaultFormValues = () => {
  return { correo: "", clave: "", confirm: "" };
};

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
  },
  input: {
    width: "100%",
  },
  btnRegister: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  btn: {
    backgroundColor: "#438282",
  },
  icon: {
    color: "#c1c1c1",
  },
});
