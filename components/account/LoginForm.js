import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { validateEmail } from "../../utils/helpers";
import { loginWithEmailAndPassword } from "../../utils/actions";
import Loading from "../Loading";
import { isEmpty } from "lodash";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorClave, setErrorClave] = useState("");
  const [loading,setLoading] = useState(false)
  const navigator =useNavigation()

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const login = async() => {
    if (!validateData()) {
      return
    }
    setLoading(true)
    const result = await loginWithEmailAndPassword(formData.correo,formData.clave)
    setLoading(false)
    if(!result.statusResponse){
      setErrorCorreo(result.error) 
      return
    }
    navigator.navigate("account")
  }

  const validateData = () => {
    setErrorCorreo("");
    setErrorClave("");
    let isValid = true;

    if (!validateEmail(formData.correo)) {
      setErrorCorreo("Debes ingresar un correo valido.");
      isValid = false;
    }

    if(isEmpty(formData.clave)){
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
       <Loading isVisible={loading} text="Ingresando a tu cuenta..."/>
    </View>
  );
}

const defaultFormValues = () => {
  return { correo: "", clave: ""};
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
});