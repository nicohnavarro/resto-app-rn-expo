import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/restaurants/Restaurants";
import AddRestaurant from "../screens/restaurants/AddRestaurant";
import Restaurant from "../screens/restaurants/Restaurant";
import AddReviewRestaurant from "../screens/restaurants/AddReviewRestaurant";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="restaurants"
        component={Restaurants}
        options={{
          title: "Restaurantes",
          headerStyle: {
            backgroundColor: "#a3bf45",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="add-restaurant"
        component={AddRestaurant}
        options={{
          title: "Agregar Restaurante",
          headerStyle: {
            backgroundColor: "#a3bf45",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="restaurant"
        component={Restaurant}
        options={{
          headerStyle: {
            backgroundColor: "#a3bf45",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="add-review-restaurant"
        component={AddReviewRestaurant}
        options={{
          title: "Nuevo Comentario",
          headerStyle: {
            backgroundColor: "#a3bf45",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
}
