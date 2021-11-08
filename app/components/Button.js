import React from "react";
import { StyleSheet, Text, TouchableOpacity,ActivityIndicator } from "react-native";

import colors from "../config/colors";

function AppButton({ title, onPress, color = "primary",loading=false }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={()=>{
        if(!loading){
          onPress()
        }
      }}
    >
      {loading?
      <ActivityIndicator color='white' size='small'/>
      :
      <Text style={styles.text}>{title}</Text>
      }
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
