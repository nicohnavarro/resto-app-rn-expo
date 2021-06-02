import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "../screens/Search";
import AddImage from "../components/AddImage";

const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="search"
        component={Search}
        // component={AddImage}
        options={{
          title: "Busqueda",
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
