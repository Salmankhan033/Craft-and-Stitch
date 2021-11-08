import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import { loginUser, getUser } from "../helper/firebasehandler";
import { StackActions } from "@react-navigation/native";
import { MyStorage } from "../helper/storage";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);
    loginUser(values.email, values.password)
      .then((response) => {
        getUser(values.email)
          .then((res) => {
            if (res.docs && res.docs.length > 0) {
              new MyStorage().setUserData(
                JSON.stringify({ ...res.docs[0].data(), id: res.docs[0].id })
              );
              props.navigation.dispatch(StackActions.replace("Home"));
            } else {
              alert("User not exists");
            }
          })
          .catch((err) => {
            console.log("eror in getting user is:", err);
          });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);

        alert(err.message);
        console.log("error in login is: ", err);
      });
  };

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo-red.png")} />

      <Form
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => handleLogin(values)}
        validationSchema={validationSchema}
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Login" loading={loading} />
      </Form>
      <TouchableOpacity onPress={() => props.navigation.navigate("FPassword")}>
        <Text>Forget Password</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 150,
    height: 100,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
});

export default LoginScreen;
