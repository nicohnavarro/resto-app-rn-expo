import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopRestaurants from "../screens/TopRestaurants";

const Stack = createStackNavigator();

export default function TopRestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="topRestaurants"
        component={TopRestaurants}
        options={{
          title: "Los Mejores Restaurantes",
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
