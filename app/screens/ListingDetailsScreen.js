import React, { useState,useEffect } from "react";
import { View, Image, StyleSheet, Alert,ScrollView } from "react-native";
import * as Yup from "yup";
import colors from "../config/colors";
import ListItem from "../components/lists/ListItem";
import Text from "../components/Text";
import { MyStorage } from "../helper/storage";
import { Form, FormField, SubmitButton } from "../components/forms";
import * as firebase from 'firebase';
import 'firebase/database';
import MapView from 'react-native-maps';

const validationSchema = Yup.object().shape({
  message: Yup.string().required().label("Message"),
  
});


function ListingDetailsScreen({ route }) {
  const listing = route.params;
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    
    new MyStorage().getUserData()
    .then(user=>{
      if(user){
      setUser(JSON.parse(user))
      }
    })
    .catch(err=>{
      Alert.alert('Error','Please restart the app')
    })
  },[])



  const sendMessage = (values,resetForm)=>{
    setLoading(true)
    let searching = `${user.id}_${listing.user.id}`
    if(parseInt(user.id)<parseInt(listing.user.id)){
      searching = `${listing.user.id}_${user.id}`
    }
   
      let data = {
        message:values.message,
        searching:`${searching}`,
        senderId:user.id,
        recieverId:listing.user.id,
        id:Date.now(),
        isRead:false,
        isSaw:false,
        createdAt:Date.now(),
      }
      firebase.database()
      .ref(`/chats/${searching}`)
      .set({
        lastMessage:values.message,
        createdAt:Date.now(),
        senderName:user.name,
        senderId:user.id,
        senderProfileImage:user.profileImage,
        recieverId:listing.user.id,
        recieverName:listing.user.name,
        recieverProfileImage:listing.user.profileImage
      })
      .then(()=>{
       firebase.database()
        .ref(`/messages/${searching}`)
        .push({
         ...data
        })
        .then(()=>{
          setLoading(false)
          Alert.alert('Done','Message sent successfully')
          resetForm({
            message:''
          })
        })
        .catch(err=>{
          console.log('error in adding messages is: ',err)
          setLoading(false)
          Alert.alert('Error','Something went wrong please try again')
        })
        
        
      })
      .catch(err=>{
        console.log('error in chats is: ',err)
        setLoading(false)
        Alert.alert('Error','Something went wrong please try again')
      })
    
  }

  return (
    <ScrollView style={{flex:1}}>
      <Image style={styles.image} source={{uri:listing.images[0]}} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>Rs:{listing.price}</Text>
        <View style={styles.userContainer}>
          <ListItem
            image={{uri:listing.user.profileImage}}
            title={listing.user.name}
            subTitle="5 Listings"
          />
        </View>
      </View>

      <View style={{margin:10}}>
      <Form
        initialValues={{ message: "" }}
        onSubmit={(values,{resetForm}) => sendMessage(values,resetForm)}
        validationSchema={validationSchema}
      >
        <FormField
          autoCorrect={false}
          icon="account"
          name="message"
          placeholder="Message"
          textContentType='name'
        />

         <SubmitButton title="Contact owner"
       loading={loading}
        />
        </Form>
        {listing.location &&
          <MapView style={styles.mapStyle}
            initialRegion={{
              latitude: listing.location.latitude,
              longitude: listing.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        }
        {listing.postal &&listing.postal.city&&
        <Text>{listing.postal.city}{listing.postal.country?`, ${listing.postal.country}`:''}</Text>
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 10,
  },
  mapStyle: {
    // width: Dimensions.get('window').width,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    height: 200,
  },
});

export default ListingDetailsScreen;
