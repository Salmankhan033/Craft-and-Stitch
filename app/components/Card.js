import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import Text from "./Text";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

function Card({ title, subTitle, image, onPress,owner=false,handleDelete,item=null }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <Image style={styles.image} source={{uri: image}} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={{flexDirection:'row'}}>
          <Text style={styles.subTitle} numberOfLines={2}>
            {subTitle}
          </Text>
          {owner && 
          <TouchableOpacity
          onPress={()=>{
            handleDelete(item)
          }}
          style={{justifyContent:'center',alignItems:'center'}}>
          
          <MaterialCommunityIcons name={'trash-can-outline'} color={'red'} size={22} />
          </TouchableOpacity>
}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "bold",
    flex:1
  },
  title: {
    marginBottom: 7,
  },
});

export default Card;
