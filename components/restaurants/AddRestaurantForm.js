import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon, Avatar } from "react-native-elements";
import CountryPicker from "react-native-country-picker-modal";
import { ScrollView } from "react-native";
import { map, size } from "lodash";
import { loadImageFromGallery } from "../../utils/helpers";

export default function AddRestaurantForm({
  toastRef,
  setLoading,
  navigation,
}) {
  const [formData, setFormData] = useState(defaultFormValues());

  const [errorName, setErrorName] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorAddress, setErrorAddress] = useState(null);
  const [errorPhone, setErrorPhone] = useState(null);
  const [imagesSelected, setImagesSelected] = useState([]);

  const addRestaurant = () => {
    console.log(formData);
    console.log("E");
  };

  return (
    <View style={styles.viewContainer}>
      <FormAdd
        formData={formData}
        setFormData={setFormData}
        errorName={errorName}
        errorDescription={errorDescription}
        errorEmail={errorEmail}
        errorAddress={errorAddress}
        errorPhone={errorPhone}
      />
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />
      <Button
        title="Agregar Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddResto}
      />
    </View>
  );
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
  const selectImage = async () => {
    const response = await loadImageFromGallery([4, 3]);
    if (!response.status) {
      toastRef.current.show("No has seleccionado ninguna imagen.", 3000);
      return;
    }
    setImagesSelected([...imagesSelected, response.image]);
  };

  return (
    <ScrollView horizontal style={styles.viewImage}>
      {size(imagesSelected) < 7 && (
        <Icon
          type="material-community"
          name="camera"
          color="#a7a7a7"
          containerStyle={styles.containerIcon}
          onPress={selectImage}
        />
      )}
      {map(imagesSelected, (imageRestaurant, index) => (
        <Avatar 
          key={index}
          avatarStyle={{borderRadius:20}}
          containerStyle={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
        />
      ))}
    </ScrollView>
  );
}

function FormAdd({
  formData,
  setFormData,
  errorName,
  errorDescription,
  errorEmail,
  errorAddress,
  errorPhone,
}) {
  const [country, setCountry] = useState("AR");
  const [callingCode, setCallingCode] = useState("54");
  const [phone, setPhone] = useState("");

  const onChangeInput = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante..."
        defaultValue={formData.name}
        onChange={(e) => onChangeInput(e, "name")}
        errorMessage={errorName}
      />
      <Input
        placeholder="Direccion del restaurante..."
        defaultValue={formData.address}
        onChange={(e) => onChangeInput(e, "address")}
        errorMessage={errorAddress}
      />
      <Input
        placeholder="Correo del restaurante..."
        keyboardType="email-address"
        defaultValue={formData.email}
        onChange={(e) => onChangeInput(e, "email")}
        errorMessage={errorEmail}
      />
      <View style={styles.phoneView}>
        <CountryPicker
          withFlag
          withCallingCode
          withFilter
          withCallingCodeButton
          containerStyle={styles.countryPicker}
          countryCode={country}
          onSelect={(country) => {
            setCountry(country.cca2);
            setCallingCode(country.callingCode[0]);
            setFormData({
              ...formData,
              country: country.cca2,
              callingCode: country.callingCode[0],
            });
          }}
        />
        <Input
          placeholder="WhatsApp del restaurante..."
          keyboardType="phone-pad"
          containerStyle={styles.inputPhone}
          defaultValue={formData.phone}
          onChange={(e) => onChangeInput(e, "phone")}
          errorMessage={errorPhone}
        />
      </View>
      <Input
        placeholder="Descripcion del restaurante..."
        multiline
        containerStyle={styles.textArea}
        defaultValue={formData.description}
        onChange={(e) => onChangeInput(e, "description")}
        errorMessage={errorDescription}
      />
    </View>
  );
}

const defaultFormValues = () => {
  return {
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    country: "AR",
    callingCode: "54",
  };
};

const styles = StyleSheet.create({
  viewContainer: {
    height: "100%",
    marginTop: 20,
  },
  viewForm: {
    marginHorizontal: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
  },
  phoneView: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputPhone: {
    width: "100%",
  },
  btnAddResto: {
    margin: 20,
    backgroundColor: "#a3bf45",
  },
  viewImage: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 80,
    width: 80,
    backgroundColor: "#e3e3e3",
    borderRadius:20
  },
  miniatureStyle: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius:20
  },
});
