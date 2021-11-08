import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View, Dimensions,Text } from "react-native";
import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import { uploadImageAsync, addPost } from '../helper/firebasehandler'
import { MyStorage } from '../helper/storage'
import MapView from 'react-native-maps';
import * as Location from "expo-location";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

const categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "bag-checked",
    label: "Bag",
    value: 1,
  },
  {
    backgroundColor: "#fd9644",
    icon: "foot-print",
    label: "Socks",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "account-hard-hat",
    label: "Knitted Caps",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "human-female-girl",
    label: "Knitted Frocks",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "boxing-glove",
    label: "Gloves",
    value: 5,
  },
  {
    backgroundColor: "#45aaf2",
    icon: "baby-face",
    label: "Scarf",
    value: 6,
  },
  {
    backgroundColor: "#4b7bec",
    icon: "pen",
    label: "Pen",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    icon: "wallpaper",
    label: "Wall Item",
    value: 8,
  },
  {
    backgroundColor: "#fc5cd5",
    icon: "bag-carry-on",
    label: "Buskets ",
    value: 9,
  },
  {
    backgroundColor: "#9ed330",
    icon: "basketball",
    label: "Sport Items",
    value: 10,
  },
  {
    backgroundColor: "#778ca3",
    icon: "hand-okay",
    label: "Mud Made Items",
    value: 11,
  },
  {
    backgroundColor: "#678923",
    icon: "application",
    label: "Other",
    value: 12,
  },
];

function ListingEditScreen() {
  const [location, setLocation] = useState(null);
  const [postal, setPostal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)


  const getLocation = async () => {
    try {
      const { granted } = await Location.requestPermissionsAsync();
      if (!granted) return;
      let location = await Location.getCurrentPositionAsync({ accuracy: 6 });
      if (location) {
        setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        const response = await Location.reverseGeocodeAsync(location.coords)
        if (response) {
          if (response.length > 0) {
            setPostal(response[0])
          }
        }
      }
      else {
        alert('Error in getting location')
      }


    } catch (error) {
      console.log('Error in getting location is: ', error);
      alert('Error in getting location')
    }
  };

  useEffect(() => {
    new MyStorage().getUserData()
      .then(user => {
        if (user) {
          setUser(JSON.parse(user))
          getLocation()
        }

      })
      .catch(err => {
        console.log('error in getting user is: ', err)
        Alert.alert('Error', 'Something went wrong please refresh the app')
      })
  }, [])

  const handlePosting = async (values, resetForm) => {
    setLoading(true)
    var images = await Promise.all(values.images.map(async (item) => {
      let uri = await uploadImageAsync(item)
      return uri
    }));
    let data = {
      ...values, images: images, location:location,
      createdAt: Date.now()
    }
    if(postal){
      data = {...data,postal}
    }
    let _user = user
    delete _user['password']
    addPost({ ...data, user: _user })
      .then(res => {
        alert('Done')
        resetForm({
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        })
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        alert(err.message)
        console.log('error in adding post is: ', err)
      })

  }

  return (
    <Screen style={styles.container}>
      <Form
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        onSubmit={(values, { resetForm }) => {
          handlePosting(values, resetForm)
        }}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <FormField maxLength={255} name="title" placeholder="Title" />
        <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder="Price"
          width={120}
        />
        <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        {location &&
          <MapView style={styles.mapStyle}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        }
        {postal &&postal.city&&
        <Text>{postal.city}{postal.country?`, ${postal.country}`:''}</Text>
        }

        <SubmitButton title="Post"
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
  mapStyle: {
    // width: Dimensions.get('window').width,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    height: 200,
  },
});
export default ListingEditScreen;
