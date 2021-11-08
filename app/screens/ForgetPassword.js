import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import * as Yup from "yup";
import * as firebase from "firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const forgetPass = (values) => {
    setLoading(true);

    firebase
      .auth()
      .sendPasswordResetEmail(values.email)
      .then(() => {
        setLoading(false);
        // Password reset email sent!
        alert("Password reset email sent!");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setLoading(false);
        alert(errorMessage);
        // ..
      });
  };

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo-red.png")} />

      <Form
        initialValues={{ email: "" }}
        onSubmit={(values) => forgetPass(values)}
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

        <SubmitButton title="Reset Password" loading={loading} />
      </Form>
    </Screen>
  );
};

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

export default ForgetPassword;
