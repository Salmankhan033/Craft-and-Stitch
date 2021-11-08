import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Modal } from "react-native";

import Card from "../components/Card";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { MyStorage } from "../helper/storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from 'firebase';
import 'firebase/firestore';

function MyListings({ navigation }) {
  const [fetching, setFetching] = useState(true)
  const [data, setData] = useState([])
  const [user, setUser] = useState(null)
  const [isDeleteModel, setIsDeleteModel] = useState(false)
  const [selectedItem,setSelectedItem] =useState(null)
  const [deleting,setDeleting] = useState(false)
  useEffect(() => {

    new MyStorage().getUserData()
      .then(_user => {
        if (_user) {
          let user = JSON.parse(_user)
          setUser(user)
          fetchPosts(user.id)

        }
      })
      .catch(err => {
        console.log('error in getting user data is: ', err)
        alert('Something went wrong please restart the app.')
      })

  }, [])

  const fetchPosts = (id) => {
    firebase.firestore().collection('posts').where('user.id','==',id).onSnapshot(res => {
        if (res && res.docs && res.docs) {
          let posts = res.docs.map(doc => {
            return { ...doc.data(), id: doc.id }
          })
          posts = posts.sort((a, b) => {
            return a.createdAt < b.createdAt
          })
          setData(posts)
          setFetching(false)
        }
        else {
          setFetching(false)
        }
      }
      ,err => {
        setFetching(false)
        alert(err.message)
        console.log('error in getting posts is: ', err)

      })
  }

  const openDeleteModel = (item) => {
    setIsDeleteModel(true)
    setSelectedItem(item)
  }


  const clearData = ()=>{
    setIsDeleteModel(false)
          setSelectedItem(null)
          setDeleting(false)
  }

  const handleDelete = ()=>{
    setDeleting(true)
    if(selectedItem){
       firebase.firestore().collection('posts').doc(selectedItem.id).delete()
       .then(res=>{
        clearData()
         console.log('response of deleting item is: ',res)
       })
       .catch(err=>{
        clearData()
         console.log('error in deleting post is: ',err)
         alert('Something went wrong please try again')
       })
    }
    else{
      alert('Error, Please try again')
      clearData()
    }
  }
  return (
    <Screen style={styles.screen}>
      {fetching ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <ActivityIndicator size='large' color='black' />
        </View>
        :
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subTitle={"Rs:" + item.price}
              image={item.images && item.images.length > 0 ? item.images[0] : null}
              owner={true}
              handleDelete={openDeleteModel}
              item={item}
            //   onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
            />
          )}
          ListEmptyComponent={() => {
            return (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                <Text>You didn't posted yet</Text>
              </View>
            )
          }}
        />
      }


      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModel}
        onRequestClose={() => {
          clearData()
          
        }}
      >
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ paddingHorizontal: 30, height: 130, borderRadius: 10, backgroundColor: 'white' }}>
            <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'black', fontSize: 17 }}>Are you sure you want to delete this post?</Text>
            </View>
            <View style={{ flex: 0.4, flexDirection: 'row', borderTopColor: 'gray', borderTopWidth: 0.5 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{
                  clearData()
                }}>
                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                onPress={()=>{
                  handleDelete()
                }}
                >
                  {deleting?
                  <ActivityIndicator color='black' size='small'/>
                  :
                  <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Yes</Text>
}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.light,
  },
});

export default MyListings;
