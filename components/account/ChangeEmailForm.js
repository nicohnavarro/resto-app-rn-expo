import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { isEmpty } from "lodash";
import { validateEmail } from "../../utils/helpers";
import { reauthenticate, updateEmail } from "../../utils/actions";

export default function ChangeEmailForm({
  email,
  setShowModal,
  toastRef,
  setReloadUser,
}) {
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true);
    const resultReauthenticate = await reauthenticate(password);
    if (!resultReauthenticate.statusResponse) {
      setLoading(false)
      setErrorPassword("Clave incorrecta.");
      return;
    }
    const resultUpdateEmail = await updateEmail(newEmail);
    setLoading(false)

    if (!resultUpdateEmail.statusResponse) {
      setErrorEmail("No puedes cambiar por este correo, ya esta en uso.");
      return;
    }

    setReloadUser(true);
    toastRef.current.show("Se ha actualizado tu correo.", 2000);
    setShowModal(false);
  };

  const validateForm = () => {
    setErrorEmail(null);
    setErrorPassword(null);
    let isValid = true;
    if (!validateEmail(newEmail)) {
      setErrorEmail("Debes ingresar un correo valido.");
      isValid=false;
    }

    if (newEmail === email) {
      setErrorEmail("Debes ingresar un correo diferente al actual.");
      isValid=false;
    }

    if (isEmpty(newEmail)) {
      setErrorEmail("Debes ingresar un correo.");
      isValid=false;
    }
    if (isEmpty(password)) {
      setErrorPassword("Debes ingresar la clave.");
      isValid=false;
    }

    return isValid;
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Ingresa nuevo correo"
        keyboardType="email-address"
        containerStyle={styles.input}
        defaultValue={email}
        onChange={(e) => setNewEmail(e.nativeEvent.text)}
        errorMessage={errorEmail}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
      />
            <Input
        placeholder="Ingresa tu clave"
        containerStyle={styles.input}
        defaultValue={password}
        onChange={(e) => setPassword(e.nativeEvent.text)}
        errorMessage={errorPassword}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={<Icon
          type="material-community"
          name= {showPassword ? "eye-off-outline":"eye-outline"}
          iconStyle={{color: "#c2c2c2"}}
          onPress={()=>setShowPassword(!showPassword)}
        />
        }
      />
      <Button
        title="Cambiar correo"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    width: "80%",
  },
  btn: {
    backgroundColor: "#a3bf45",
  },
});
