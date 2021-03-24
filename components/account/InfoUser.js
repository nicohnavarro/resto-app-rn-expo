import React, { useState } from "react";
import { Alert } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { updateProfile, uploadImage } from "../../utils/actions";
import { loadImageFromGallery } from "../../utils/helpers";

export default function InfoUser({ user, setLoading, setLoadingText }) {
  const [photoUrl, setPhotoUrl] = useState(user.photoURL);
  const changePhoto = async () => {
    const result = await loadImageFromGallery([1, 1]);
    if (!result.status) {
      return;
    }
    setLoadingText("Actualizando imagen...");
    setLoading(true);
    const resultUploadImage = await uploadImage(
      result.image,
      "avatars",
      user.uid
    );
    if (!resultUploadImage.statusResponse) {
      setloading(false);
      Alert.alert("ops, Ocurrio un error");
      return;
    }
    
    const resultUpdateProfile = await updateProfile({
      photoURL: resultUploadImage.url,
    });
    setLoading(false)
    if (resultUpdateProfile.statusResponse) {
      setPhotoUrl(resultUploadImage.url);
    } else {
      Alert.alert("ops, Ocurrio un error 2");
    }
  };

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size="large"
        onPress={changePhoto}
        containerStyle={styles.avatar}
        source={
          photoUrl
            ? { uri: photoUrl }
            : require("../../assets/avatardefault.png")
        }
      />
      <View style={styles.infoUser}>
        <Text style={styles.displayName}>
          {user.displayName ? user.displayName : "Anomino"}
        </Text>
        <Text>{user.email}</Text>
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
  infoUser: {
    marginLeft: 20,
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
});
