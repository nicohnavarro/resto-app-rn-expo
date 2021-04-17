import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CarouselImages from "../../components/CarouselImages";
import Loading from "../../components/Loading";
import MyCarousel from "../../components/MyCarousel";
import { getDocumentById } from "../../utils/actions";

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route }) {
  const { id, name } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  navigation.setOptions({ title: name });

  useEffect(() => {
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
  }, []);

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
  }

  return (
    <ScrollView style={styles.viewBody}>
      <CarouselImages
      images={restaurant.images}
      height={250}
      width={widthScreen}
      activeSlide={activeSlide}
      setActiveSlide={setActiveSlide}
      />
      {/* <MyCarousel/> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody:{
    flex:1,
  }
});
