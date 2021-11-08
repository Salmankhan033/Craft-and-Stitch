import React, { useEffect, useState } from "react";
import { StyleSheet, Image,ActivityIndicator,Text } from "react-native";


import Screen from "../components/Screen";
import { StackActions } from '@react-navigation/native';
import { MyStorage } from "../helper/storage";





function Loading(props) {
    useEffect(()=>{
        new MyStorage().getUserData()
        .then(data=>{
            if(data)
            props.navigation.dispatch(
                StackActions.replace('Home')
              );
              else{
                props.navigation.dispatch(
                    StackActions.replace('Welcome')
                  );
              }
        })
        .catch(err=>{
            console.log('error in getting user data is: ',err)
        })
    })
  
  return (
    <Screen style={styles.container} >
     <ActivityIndicator size='large' color='black'/>
     <Text style={{textAlign:'center',marginTop:10}}>Loading user data</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 300,
    // flex:1,
    // justifyContent:'center',
    // alignItems:'center'
  },
 
});

export default Loading;
