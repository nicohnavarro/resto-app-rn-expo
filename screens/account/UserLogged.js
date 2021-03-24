import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon } from "react-native-elements";
import { closeSession, getCurrentUser } from "../../utils/actions";
import Toast from "react-native-easy-toast";

import Loading from "../../components/Loading";
import InfoUser from "../../components/account/InfoUser";
import AccountOptions from "../../components/account/AccountOptions";

export default function UserLogged() {
  const toastRef = useRef();
  const navigation = useNavigation();

  const [loadingText, setLoadingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [reloadUser, setReloadUser] = useState(false);
  useEffect(() => {
    setUser(getCurrentUser());
    setReloadUser(false)
  }, [reloadUser]);

  const handleLogOut = () => {
    closeSession();
    navigation.navigate("restaurants");
  };
  return (
    <View style={styles.container}>
      {user && (
        <View>
          <InfoUser
            user={user}
            setLoading={setLoading}
            setLoadingText={setLoadingText}
          />
          <AccountOptions 
          user={user} 
          toastRef={toastRef} 
          setReloadUser={setReloadUser}
          />
        </View>
      )}

      <Button
        title="Cerrar sesion"
        onPress={() => handleLogOut()}
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionTitle}
        // icon={
        //   <Icon
        //     type="material-community"
        //     name="exit-to-app"
        //     iconStyle={styles.icon}
        //   />
        // }
      />
      <Toast ref={toastRef} style={{backgroundColor:'green'}} position="center" opacity={0.8} />
      <Loading isVisible={loading} text={loadingText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#f9f9f9",
  },
  btnCloseSession: {
    marginTop: 30,
    borderRadius: 5,
    backgroundColor: "#a3bf45",
    borderTopWidth: 1,
    borderTopColor: "#a3bf45",
    borderBottomWidth: 1,
    borderBottomColor: "#a3bf45",
  },
  btnCloseSessionTitle: {
    color: "#ffffff",
  },
});
