import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/account/Account";
import Login from "../screens/account/Login";
import Register from "../screens/account/Register";
import RecoverPassword from "../screens/account/RecoverPassword";

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="account"
        component={Account}
        options={{
          title: "Cuenta",
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
        name="login"
        component={Login}
        options={{
          title: "Iniciar Sesion",
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
        name="register"
        component={Register}
        options={{
          title: "Registrar Usuario",
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
        name="recover-password"
        component={RecoverPassword}
        options={{
          title: "Recuperar Clave",
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
