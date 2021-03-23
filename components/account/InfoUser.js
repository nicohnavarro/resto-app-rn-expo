import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";

export default function InfoUser({ user }) {
  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size="large"
        containerStyle={styles.avatar}
        source={
          user.photoURL
            ? { uri: photoURL }
            : require("../../assets/avatardefault.png")
        }
      />
      <View style={styles.infoUser}>
        <Text style={styles.displayName}>
          {user.displayName ? user.displayName : "Anomino"}
        </Text>
        <Text>
          {user.email}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    paddingVertical: 30,
  },
  avatar: {},
  infoUser:{
    marginLeft:20
  },
  displayName:{
    fontWeight:"bold",
    paddingBottom:5
  }
});
