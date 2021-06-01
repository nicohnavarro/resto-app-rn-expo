import React, { useState, useCallback, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Alert, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Rating, ListItem, Icon, Input, Button } from "react-native-elements";
import CarouselImages from "../../components/CarouselImages";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import MyCarousel from "../../components/MyCarousel";
import {
  addDocumentWithoutId,
  getCurrentUser,
  getDocumentById,
  getIsFavorite,
  deleteFavorite,
  sendPushNotification,
  setNotificationMessage,
  getUsersFavorites,
} from "../../utils/actions";
import {
  callNumber,
  formatPhone,
  sendEmail,
  sendWhatsApp,
} from "../../utils/helpers";
import MapRestaurant from "../../components/restaurants/MapRestaurant";
import { isEmpty, map, set } from "lodash";
import ListReviews from "../../components/restaurants/ListReviews";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "firebase/app";
import Toast from "react-native-easy-toast";

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route }) {
  const { id, name } = route.params;
  const toastRef = useRef();
  const [restaurant, setRestaurant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalNotification, setModalNotification] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setIsLogged(true) : setIsLogged(false);
    setCurrentUser(user);
  });

  const addFavorite = async () => {
    if (!isLogged) {
      toastRef.current.show("Necesitas estar logeado para agregar", 3000);
      return;
    }

    setLoading(true);
    const response = await addDocumentWithoutId("favorites", {
      idUser: getCurrentUser().uid,
      idRestaurant: restaurant.id,
    });
    if (response.statusResponse) {
      setIsFavorite(true);
      toastRef.current.show("Se agrego a favoritos!", 3000);
    } else {
      toastRef.current.show("No se agrego a favoritos.", 3000);
    }
    setLoading(false);
  };

  const removeFavorite = async () => {
    setLoading(true);
    const response = await deleteFavorite(restaurant.id);
    if (response.statusResponse) {
      setIsFavorite(false);
      toastRef.current.show("Se elimino de favoritos!", 3000);
    } else {
      toastRef.current.show("No se pudo eliminar de favoritos.", 3000);
    }
    setLoading(false);
  };

  navigation.setOptions({ title: name });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const response = await getDocumentById("restaurants", id);
        if (response.statusResponse === true) {
          setRestaurant(response.document);
        } else {
          setRestaurant({});
          Alert.alert(
            "Ocurrio un problema cargando el restaurante, intente mas tarde."
          );
        }
      })();
    }, [])
  );

  useEffect(() => {
    (async () => {
      if (isLogged && restaurant) {
        const response = await getIsFavorite(restaurant.id);
        if (response.statusResponse) {
          setIsFavorite(response.isFavorite);
        }
      }
    })();
  }, [isLogged, restaurant]);

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
  }

  return (
    <ScrollView style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "red" : "grey"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <CarouselImages
        images={restaurant.images}
        height={250}
        width={widthScreen}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />
      {/* <MyCarousel/> */}
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.rating}
      />
      <RestaurantInfo
        name={restaurant.name}
        location={restaurant.location}
        address={restaurant.address}
        email={restaurant.email}
        phone={formatPhone(restaurant.callingCode, restaurant.phone)}
        currentUser={currentUser}
        setLoading={setLoading}
        setModalNotification={setModalNotification}
      />
      <ListReviews navigation={navigation} idRestaurant={restaurant.id} />
      <SendMessage
        modalNotification={modalNotification}
        setModalNotification={setModalNotification}
        setLoading={setLoading}
        restaurant={restaurant}
      />
      <Toast ref={toastRef} position="center" opacity={0.8} />
      <Loading isVisible={loading} text="Espere un momento por favor" />
    </ScrollView>
  );
}

function TitleRestaurant({ name, description, rating = 0 }) {
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={styles.viewRestaurantContainer}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}

function RestaurantInfo({
  name,
  location,
  address,
  email,
  phone,
  currentUser,
  setLoading,
  setModalNotification,
}) {
  const listInfo = [
    {
      type: "address",
      text: address,
      iconLeft: "map-marker",
      iconRight: "message-text-outline",
    },
    {
      type: "phone",
      text: phone,
      iconLeft: "phone",
      iconRight: "whatsapp",
    },
    { type: "email", text: email, iconLeft: "at" },
  ];

  const actionLeft = (type) => {
    if (type === "phone") {
      callNumber(phone);
    } else if (type === "email") {
      if (currentUser) {
        sendEmail(
          email,
          "Interesado",
          `Soy ${currentUser.displayName} estoy interesado en sus servicios`
        );
      } else {
        sendEmail(
          email,
          "Interesado",
          "Estoy interesado estoy interesado en sus servicios"
        );
      }
    }
  };

  const actionRight = (type) => {
    if (type === "phone") {
      if (currentUser) {
        sendWhatsApp(
          phone,
          `Soy ${currentUser.displayName} estoy interesado en sus servicios`
        );
      } else {
        sendWhatsApp(
          phone,
          "Estoy interesado estoy interesado en sus servicios"
        );
      }
    } else if (type === "address") {
      setModalNotification(true);
    }
  };

  return (
    <View styles={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Informacion sobre Restaurante
      </Text>
      <MapRestaurant name={name} location={location} height={150} />
      {map(listInfo, (item, index) => (
        <ListItem key={index} style={styles.containerListItem}>
          <Icon
            type="material-community"
            name={item.iconLeft}
            color="#442421"
            onPress={() => actionLeft(item.type)}
          />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
          {item.iconRight && (
            <Icon
              type="material-community"
              name={item.iconRight}
              color="#442421"
              onPress={() => actionRight(item.type)}
            />
          )}
        </ListItem>
      ))}
    </View>
  );
}

function SendMessage({
  modalNotification,
  setModalNotification,
  setLoading,
  restaurant,
}) {
  const [title, setTitle] = useState(null);
  const [errorTitle, setErrorTitle] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const sendNotification = async () => {
    if (!isValidForm()) return;

    setLoading(true);
    const userName = getCurrentUser().displayName
      ? getCurrentUser().displayName
      : "Anonimo";
    const theMessage = `${message}, del restaurante ${restaurant.name}`;

    const usersFavorites = await getUsersFavorites(restaurant.id);
    if (!usersFavorites.statusResponse) {
      setLoading(false);
      Alert.alert("Error al obtener los usuarios que aman el restaurante");
      return;
    }

    await Promise.all(
      map(usersFavorites.users, async (user) => {
        const messageNotification = setNotificationMessage(
          user.token,
          `${userName} dijo: ${title}`,
          theMessage,
          { data: theMessage }
        );
        await sendPushNotification(messageNotification);
      })
    );
    setLoading(false);
    Alert.alert("Se ha enviado el mensaje");
    cleanInputs();
  };

  const cleanInputs = () => {
    setTitle(null);
    setMessage(null);
    setErrorTitle(null);
    setErrorMessage(null);
    setModalNotification(false);
  };

  const isValidForm = () => {
    let isValid = true;
    if (isEmpty(title)) {
      setErrorTitle("Debes ingresar un titulo a tu mensaje");
      isValid = false;
    }
    if (isEmpty(message)) {
      setErrorMessage("Debes ingresar un mensaje");
      isValid = false;
    }
    return isValid;
  };

  return (
    <Modal isVisible={modalNotification} setVisible={setModalNotification}>
      <View style={styles.modalContainer}>
        <Text style={styles.textModal}>
          Enviale un mensaje a los amantes de {restaurant.name}
        </Text>
        <Input
          placeholder="Titulo del mensaje.."
          onChangeText={(text) => setTitle(text)}
          value={title}
          errorMessage={errorTitle}
        />
        <Input
          inputStyle={styles.textArea}
          placeholder="Tu mensaje.."
          onChangeText={(text) => setMessage(text)}
          value={message}
          errorMessage={errorMessage}
        />
        <Button
          title="Enviar mensaje"
          buttonStyle={styles.btnSend}
          containerStyle={styles.btnSendContainer}
          onPress={sendNotification}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  viewRestaurantContainer: {
    flexDirection: "row",
  },
  nameRestaurant: {
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "gray",
    textAlign: "justify",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  restaurantInfoTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
  },
  containerListItem: {
    borderBottomColor: "#423123",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
    zIndex: 100,
  },
  textArea: {
    height: 50,
    paddingHorizontal: 10,
  },
  btnSend: {
    backgroundColor: "#434243",
  },
  btnSendContainer: {
    width: "50%",
  },
  textModal: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
