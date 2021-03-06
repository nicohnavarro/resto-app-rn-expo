import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { formatPhone } from "../../utils/helpers";

export default function ListRestaurants({
  restaurants,
  navigation,
  handleLoadMore,
}) {
  return (
    <View>
      <FlatList
        data={restaurants}
        onEndReachedThreshold={0.5}
        // onEndReached={handleLoadMore}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(restaurant) => (
          <Restaurant restaurant={restaurant} navigation={navigation} />
        )}
      />
    </View>
  );
}

function Restaurant({ restaurant, navigation, handleLoadMore }) {
  const {
    id,
    images,
    name,
    address,
    description,
    phone,
    callingCode,
  } = restaurant.item;
  const imageRestaurant = images[0];

  const goRestaurant = () => {
    navigation.navigate("restaurant",{id, name});
  };
  return (
    <TouchableOpacity onPress={goRestaurant}>
      <View style={styles.viewResto}>
        <View style={styles.viewRestoImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#fff" />}
            source={{ uri: imageRestaurant }}
            style={styles.imageResto}
          />
        </View>
        <View style={styles.viewRestoImage}>
          <Text style={styles.restoTitle}>{name}</Text>
          <Text style={styles.restoInfo}>{address}</Text>
          <Text style={styles.restoInfo}>
            {formatPhone(callingCode, phone)}
          </Text>
          <Text style={styles.restoDescription}>
            {size(description) > 30
              ? `${description.substr(0, 60)}...`
              : description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewResto: {
    flexDirection: "row",
    margin: 10,
  },
  viewRestoImage: {
    margin: 10,
  },
  imageResto: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  restoTitle: {
    fontWeight: "bold",
  },
  restoInfo: {
    paddingTop: 2,
    color: "grey",
  },
  restoDescription: {
    paddingTop: 2,
    color: "grey",
    width: "75%",
  },
});
