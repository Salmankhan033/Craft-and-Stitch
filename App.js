import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {LogBox} from 'react-native'
import navigationTheme from "./app/navigation/navigationTheme";
import AuthNavigator from "./app/navigation/AuthNavigator";
import * as firebase from 'firebase';
import {firebaseConfig} from "./config"

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";


if (!firebase.apps.length) {
  try {
      firebase.initializeApp(firebaseConfig)
  } catch (err) {
    console.log(err)
     
  }
}
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
LogBox.ignoreAllLogs(true)
export default function App() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <AuthNavigator />
    </NavigationContainer>
  );
}
 