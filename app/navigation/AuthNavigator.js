import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import AppNavigator from "./AppNavigator";
import Loading from "../screens/Loading";
import ForgetPassword from "../screens/ForgetPassword";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Loading"
      component={Loading}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen
      name="FPassword"
      component={ForgetPassword}
      options={{ title: "Reset Password" }}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="Home"
      component={AppNavigator}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
