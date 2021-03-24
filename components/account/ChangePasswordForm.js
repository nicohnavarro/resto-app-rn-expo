import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { isEmpty, size } from "lodash";
import { validateEmail } from "../../utils/helpers";
import { reauthenticate, updateEmail, updatePassword } from "../../utils/actions";

export default function ChangePasswordForm({
  setShowModal,
  toastRef,
  setReloadUser,
}) {
  const [newPassword, setNewPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorNewPassword, setErrorNewPassword] = useState(null);
  const [errorCurrentPassword, setErrorCurrentPassword] = useState(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const resultReauthenticate = await reauthenticate(currentPassword);
    if (!resultReauthenticate.statusResponse) {
      setLoading(false)
      setErrorCurrentPassword("Clave incorrecta.");
      return;
    }
    const resultUpdatePassword= await updatePassword(newPassword);
    setLoading(false)

    if (!resultUpdatePassword.statusResponse) {
      setErrorNewPassword("No puedes cambiar por esta clave, ocurrio un error.");
      return;
    }

    setReloadUser(true);
    toastRef.current.show("Se ha actualizado tu clave.", 2000);
    setShowModal(false);
  };

  const validateForm = () => {
    setErrorNewPassword(null);
    setErrorCurrentPassword(null);
    setErrorConfirmPassword(null);

    let isValid = true;

    if (isEmpty(newPassword)) {
      setErrorNewPassword("Debes ingresar una clave.");
      isValid = false;
    }
    if (size(newPassword) < 6) {
      setErrorNewPassword("Debes ingresar una clave mayor a 6 caracteres.");
      isValid = false;
    }

    if (size(confirmPassword) < 6) {
      setErrorConfirmPassword(
        "Debes ingresar una confirmacion de clave mayor a 6 caracteres."
      );
      isValid = false;
    }

    if (isEmpty(confirmPassword)) {
      setErrorConfirmPassword("Debes ingresar la confirmacion de la clave.");
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setErrorNewPassword("La clave y la confirmacion deben ser iguales");
      setErrorConfirmPassword("La clave y la confirmacion deben ser iguales");
      isValid = false;
    }

    if (newPassword === currentPassword) {
      setErrorCurrentPassword("Las claves deben ser distintas");
      setErrorNewPassword("La clave y la confirmacion deben ser distintas");
      isValid = false;
    }

    return isValid;
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Ingresa tu clave actual..."
        containerStyle={styles.input}
        defaultValue={currentPassword}
        onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
        errorMessage={errorCurrentPassword}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={{ color: "#c2c2c2" }}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder="Ingresa tu nueva clave..."
        containerStyle={styles.input}
        defaultValue={newPassword}
        onChange={(e) => setNewPassword(e.nativeEvent.text)}
        errorMessage={errorNewPassword}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={{ color: "#c2c2c2" }}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder="Confirma tu nueva clave..."
        containerStyle={styles.input}
        defaultValue={confirmPassword}
        onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
        errorMessage={errorConfirmPassword}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={{ color: "#c2c2c2" }}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Button
        title="Cambiar clave"
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
