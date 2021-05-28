import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Dimensions,
  ScrollView
} from "react-native";
import { Input, Button, Icon, Avatar, Image } from "react-native-elements";
import CountryPicker from "react-native-country-picker-modal";
import { map, size, filter, set, isEmpty } from "lodash";
import {
  getCurrentLocation,
  loadImageFromGallery,
  validateEmail,
} from "../../utils/helpers";
import Modal from "../Modal";
import MapView from "react-native-maps";
import {
  addDocumentWithoutId,
  getCurrentUser,
  uploadImage,
} from "../../utils/actions";
import uuid from "uuid-random";

const widthScreen = Dimensions.get("window").width;

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
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const validForm = () => {
    clearErrors();
    let isValid = true;

    if (isEmpty(formData.name)) {
      setErrorName("Debes agregar un nombre al restaurante.");
      isValid = false;
    }
    if (isEmpty(formData.address)) {
      setErrorAddress("Debes agregar una direccion al restaurante.");
      isValid = false;
    }
    if (isEmpty(formData.email)) {
      setErrorEmail("Debes agregar un mail al restaurante.");
      isValid = false;
    }
    if (!validateEmail(formData.email)) {
      setErrorEmail("Debes agregar un mail correcto al restaurante.");
      isValid = false;
    }
    if (size(formData.email) < 10) {
      setErrorEmail("Debes agregar un telefono valido al restaurante.");
      isValid = false;
    }
    if (isEmpty(formData.phone)) {
      setErrorPhone("Debes agregar un telefono al restaurante.");
      isValid = false;
    }

    if (!locationRestaurant) {
      toastRef.current.show("Debes localizar el mapa en el restaurante.");
      isValid = false;
    } else if (size(imagesSelected) === 0) {
      toastRef.current.show("Debes subir al menos una foto del restaurante.");
      isValid = false;
    }

    return isValid;
  };

  const clearErrors = () => {
    setErrorName("");
    setErrorAddress("");
    setErrorPhone("");
    setErrorEmail("");
    setErrorName("");
  };

  const addRestaurant = async () => {
    if (!validForm()) {
      return;
    }
    setLoading(true);
    const responseUploadImages = await uploadImages();
    const restaurant = buildRestaurant(responseUploadImages);
    const responseDoc = await addDocumentWithoutId("restaurants", restaurant);
    setLoading(false);
    if (!responseDoc.statusResponse) {
      toastRef.current.show(
        "Error al guardar restaurante, por favor intenta mas tarde.",
        3000
      );
      return;
    }

    navigation.navigate("restaurants");
  };

  const buildRestaurant = (images) => {
    return {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      callingCode: formData.callingCode,
      country: formData.country,
      email: formData.email,
      description: formData.description,
      location: locationRestaurant,
      images: images,
      ranking: 0,
      rankingTotal: 0,
      quantityVoting: 0,
      createAt: new Date(),
      createBy: getCurrentUser().uid,
    };
  };

  const uploadImages = async () => {
    const imagesUrl = [];
    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await uploadImage(image, "restaurants", uuid());
        if (response.statusResponse) {
          imagesUrl.push(response.url);
        }
      })
    );
    return imagesUrl;
  };

  return (
    <ScrollView style={styles.viewContainer}>
      <ImageRestaurant imageRestaurant={imagesSelected[0]} />
      <FormAdd
        formData={formData}
        setFormData={setFormData}
        errorName={errorName}
        errorDescription={errorDescription}
        errorEmail={errorEmail}
        errorAddress={errorAddress}
        errorPhone={errorPhone}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
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
      <MapRestaurant
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function MapRestaurant({
  isVisibleMap,
  setIsVisibleMap,
  setLocationRestaurant,
  toastRef,
}) {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      const responseLocation = await getCurrentLocation();
      if (responseLocation.status) {
        setRegion(responseLocation.location);
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(region);
    toastRef.current.show("Localizacion guardada correctamente", 3000);
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
      <View>
        {region && (
          <MapView
            style={styles.mapStyle}
            initialRegion={region}
            showsUserLocation
            onRegionChange={(region) => setRegion(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar ubicacion"
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar ubicacion"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

function ImageRestaurant({ imageRestaurant }) {
  return (
    <View style={styles.viewPhoto}>
      <Image
        style={{
          width: widthScreen,
          height: 250,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : require("../../assets/avatardefault.png")
        }
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

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar Imagen",
      "Estas seguro que queres borrar esta foto?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Si",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
          style: "",
        },
      ],
      { cancelable: true }
    );
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
          avatarStyle={{ borderRadius: 20 }}
          containerStyle={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
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
  setIsVisibleMap,
  locationRestaurant,
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
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#a3bf45" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
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
    borderRadius: 20,
  },
  miniatureStyle: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 20,
  },
  viewPhoto: {
    alignItems: "center",
    height: 250,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#c1c1c1",
  },
  viewMapBtnSave: {
    backgroundColor: "#a3bf45",
  },
});
