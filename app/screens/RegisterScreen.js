import React,{useState} from "react";
import { StyleSheet, Image,View,Alert } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import {registerUser,addUser} from '../helper/firebasehandler'
import { StackActions } from '@react-navigation/native';
import {MyStorage} from '../helper/storage'
import FormImagePicker from "../components/forms/FormImagePicker";
import {uploadProfileImage} from '../helper/firebasehandler'
function RegisterScreen(props) {
  const [loading,setLoading] = useState(false)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).label("Password"),
    gender:Yup.string().oneOf(['Male',,'Female',]).required()
  });
  
  
  const handleRegisteration = (values)=>{
    
    if(values.images.length===0){
      Alert.alert('Error','Please select a profile image')
      return
    }
    setLoading(true)
    uploadProfileImage(values.images[0])
    .then(uri=>{
      registerUser(values.email,values.password)
      .then(data=>{
        let newValues = values
        delete newValues['images'] 
        let userId = Date.now().toString()
      addUser({...newValues,profileImage:uri},userId)
      .then(response=>{
      setLoading(false)
        new MyStorage().setUserData(JSON.stringify({...newValues,id:userId,profileImage:uri}))
      props.navigation.dispatch(
        StackActions.replace('Home')
      );
      }).catch(err=>{
      setLoading(false)
        alert(err.message)
        console.log('error in adding user is: ',err)
      })
    })
    .catch(err=>{
      setLoading(false)
      alert(err.message)
      console.log('error is: ',err.message)
    })
    })
    .catch(err=>{
      console.log('error in uploading image is: ',err)
      Alert.alert('Error','Something went wrong Please try again')
    })
    
    
  }

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo-red.png")} />
      <Form
        initialValues={{ name: "", email: "", password: "",gender:"",images:[] }}
        onSubmit={(values) => handleRegisteration(values)}
        validationSchema={validationSchema}
      >
       
        <FormImagePicker name="images" />
        
        <FormField
          autoCorrect={false}
          icon="account"
          name="name"
          placeholder="Name"
          textContentType='name'
        />
        <FormField
          autoCorrect={false}
          icon="human-male-female"
          name="gender"
          placeholder="Gender"
        />
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
          icon="phone"
          keyboardType="number-pad"
          name="phone"
          placeholder="Phone"
          textContentType="telephoneNumber"

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
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Confirm Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Register"
       loading={loading}
        />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    
  },
  logo: {
    alignSelf: "center",
    width:200,
    height:150,
  },
});

export default RegisterScreen;
