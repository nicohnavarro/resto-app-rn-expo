import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RestaurantsStack from "./RestaurantsStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import FavoritesStack from "./FavoritesStack";
import AccountStack from "./AccountStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="restaurants" 
          component={RestaurantsStack}
          options={{title:"Restaurantes"}} />
        <Tab.Screen name="favorites" 
          component={FavoritesStack}
          options={{title:"Favoritos"}} />
        <Tab.Screen name="topRestaurants" 
          component={TopRestaurantsStack} 
          options={{title:" Podio"}}/>
        <Tab.Screen name="search" 
          component={SearchStack} 
          options={{title:"Busqueda"}} />
        <Tab.Screen name="account" 
          component={AccountStack} 
          options={{title:"Cuenta"}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
