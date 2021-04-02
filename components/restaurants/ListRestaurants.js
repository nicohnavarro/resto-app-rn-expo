import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";

export default function ListRestaurants({ restaurants, navigation }) {
  return (
    <View>
      <FlatList
        data={restaurants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(restaurant) => (
          <Restaurant restaurant={restaurant} navigation={navigation} />
        )}
      />
      <Text>rrstooos</Text>
    </View>
  );
}

function Restaurant({ restaurant, navigation }) {
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

  return (
    <TouchableOpacity>
      <View style={styles.viewResto}>
        <View style={styles.viewRestoImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#fff" />}
            source={{ uri: imageRestaurant }}
            style={styles.imageResto}
          />
        </View>
      </View>
      <View>
        <Text style={styles.restoTitle}>{name}</Text>
        <Text style={styles.restoInfo}>{address}</Text>
        <Text style={styles.restoInfo}>
          {callingCode}-{phone}
        </Text>
        <Text style={styles.restoDescription}>
          {size(description) > 0
            ? `${description.substr(0, 60)}...`
            : description}
        </Text>
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
    margin: 15,
  },
  imageResto: {
    width: 90,
    height: 90,
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
