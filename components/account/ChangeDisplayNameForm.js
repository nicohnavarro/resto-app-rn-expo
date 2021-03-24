import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { isEmpty } from "lodash";

import { updateProfile } from "../../utils/actions";

export default function ChangeDisplayNameForm({
  displayName,
  setShowModal,
  toastRef,
  setReloadUser,
}) {
  const [newDisplayName, setNewDisplayName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateForm()) {
    }

    setLoading(true);
    const result = await updateProfile({ displayName: newDisplayName });
    setLoading(false);
    if (!result.statusResponse) {
      setError("Error al actualizar nombre y apellido");
      return;
    }
    setReloadUser(true);
    toastRef.current.show("Se han actualizado nombre y apellido",2000)
    setShowModal(false);
  };

  const validateForm = () => {
    setError(null);

    if (isEmpty(newDisplayName)) {
      setError("Debes ingresar nombre y apellidos");
      return false;
    }

    if (newDisplayName === displayName) {
      setError("Debes ingresar numbres y apellidos diferentes a los actuales");
      return false;
    }

    return true;
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Ingresa nombre y apellido"
        containerStyle={styles.input}
        defaultValue={displayName}
        onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
        errorMessage={error}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
      />
      <Button
        title="Cambiar nombre y apellido"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
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
