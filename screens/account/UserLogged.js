import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon } from "react-native-elements";
import { closeSession } from "../../utils/actions";

export default function UserLogged() {
  const navigation = useNavigation();

  const handleLogOut = () => {
    closeSession();
    navigation.navigate("restaurants")
  };
  return (
    <View>
      <Text>User Loggeado</Text>

      <Button
        title="Cerrar sesion"
        onPress={() => handleLogOut()}
        icon={
          <Icon
            type="material-community"
            name="exit-to-app"
            iconStyle={styles.icon}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
