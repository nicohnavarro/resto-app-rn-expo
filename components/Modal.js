import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Overlay } from "react-native-elements";

export default function Modal({ isVisible, setVisible, children }) {
  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setVisible(false)}
      backdropColor={"transparent"}
    >
      {children}
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: "80%",
    borderRadius: 10,
  },
  backdrop: {
    backgroundColor: "#a3bf45",
    opacity: 0.6,
  },
});
