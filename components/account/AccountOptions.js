import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import { map } from "lodash";

import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions({ user, toastRef, setReloadUser }) {
  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const generatedOptions = () => {
    return [
      {
        title: "Cambiar Nombre y Apellido",
        iconNameLeft: "account-circle",
        iconColorLeft: "#a3bf45",
        IconNameRight: "chevron-right",
        iconColorRight: "#a3bf45",
        onPress: () => selectedComponent("displayName"),
      },
      {
        title: "Cambiar Correo",
        iconNameLeft: "at",
        iconColorLeft: "#a3bf45",
        IconNameRight: "chevron-right",
        iconColorRight: "#a3bf45",
        onPress: () => selectedComponent("correo"),
      },
      {
        title: "Cambiar Clave",
        iconNameLeft: "lock-reset",
        iconColorLeft: "#a3bf45",
        IconNameRight: "chevron-right",
        iconColorRight: "#a3bf45",
        onPress: () => selectedComponent("clave"),
      },
    ];
  };

  const selectedComponent = (key) => {
    switch (key) {
      case "displayName":
        setRenderComponent(
          <ChangeDisplayNameForm
            displayName={user.displayName}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setReloadUser={setReloadUser}
          />
        );
        break;
      case "correo":
        setRenderComponent(
          <ChangeEmailForm
            email={user.email}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setReloadUser={setReloadUser}
          />
        );
        break;
      case "clave":
        setRenderComponent(
          <ChangePasswordForm
            setShowModal={setShowModal}
            toastRef={toastRef}
            setReloadUser={setReloadUser}
          />
        );
        break;
    }
    setShowModal(true);
  };

  const menuOptions = generatedOptions();
  return (
    <View>
      {map(menuOptions, (menu, index) => (
        <ListItem key={index} style={styles.menuItem} onPress={menu.onPress}>
          <Icon
            type="material-community"
            name={menu.iconNameLeft}
            color={menu.iconColorLeft}
          />
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <Icon
            type="material-community"
            name={menu.IconNameRight}
            color={menu.iconColorRight}
          />
        </ListItem>
      ))}
      <Modal
        isVisible={showModal}
        setVisible={setShowModal}
        children={renderComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#a3bf45",
  },
});
