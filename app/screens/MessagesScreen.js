import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View,TouchableOpacity } from "react-native";
import * as firebase from 'firebase';
import 'firebase/database';
import Screen from "../components/Screen";

import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import { MyStorage } from "../helper/storage";
import { render } from "react-dom";

class MessagesScreen extends React.Component  {
  constructor(){
    super()
    this.state={
      user:null,
      fetching:true,
      chats:[],
      refreshing:false,
      chatsTemp:{}
    }
  }

componentDidMount = ()=>{
  new MyStorage().getUserData()
  .then(user=>{
    if(user){
      this.setState({user:JSON.parse(user)},()=>{
        this.fetchMessages()
      })
      
    }
    
  })
  .catch(err=>{
    console.log('error in getting user data is: ',err)
    Alert.alert('Error','Something went wrong please restart the app')
  })
}
componentWillUnmount = ()=>{
     firebase.database()
    .ref(`/chats`)
    .orderByChild(`recieverId`).equalTo(this.state.user.id)
        .off('value', this.onValueChange);

        firebase.database()
    .ref(`/chats`)
    .orderByChild(`senderId`).equalTo(this.state.user.id)
        .off('value', this.onValueChange);
   
}
  // useEffect(()=>{
   

    // return (()=>{
    //   firebase.database()
    // .ref(`/chats`)
    // .orderByChild(`recieverId`).equalTo(user.id)
    //     .off('value', onValueChange);

    //     firebase.database()
    // .ref(`/chats`)
    // .orderByChild(`senderId`).equalTo(user.id)
    //     .off('value', onValueChange);
    // })
  // },[])

   fetchMessages = ()=>{
    firebase.database()
      .ref(`/chats`)
      .orderByChild(`recieverId`).equalTo(this.state.user.id)
      .on('value',this.onValueChange)

      firebase.database()
      .ref(`/chats`)
      .orderByChild(`senderId`).equalTo(this.state.user.id)
      .on('value',this.onValueChange)
    
  }

   onValueChange = (snapshot)=>{
    if(snapshot.val()){
      let data = snapshot.val()
      let keys = Object.keys(data)
      let temp = this.state.chatsTemp
      let tempChats = keys.map(key=>{
        temp[key] = {...data[key],key}
        return {...data[key],key}
      })
      
       this.setState({fetching:false,chats:Object.values(temp),chatsTemp:temp})
      }
      else{
          this.setState({fetching:false})
      }
  }


   handleDelete = (item) => {
    firebase.database()
      .ref(`/chats/${item.key}`)
      .remove()
  };

  renderMessage = (lastMessage)=>{
    if(lastMessage.includes('\n')){
     let temp =  lastMessage.split("\n");
     return temp[0].length>25?`${temp[0].substr(0, 25)}...`:temp[0]
    }
    else
    return lastMessage.length>25?`${lastMessage.substr(0, 25)}...`:lastMessage
  }
  render(){
    // console.log('hcats are: ',this.state.chats)
  return (
    <Screen >
      {this.state.fetching ?
       <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:50}}>
       <ActivityIndicator color='black' size={'large'}/>
       </View>
      :
      <FlatList
      style={{flex:1}}
      contentContainerStyle={{flex:1}}
        data={this.state.chats}
        keyExtractor={(message) => message.key}
        renderItem={({ item }) => (
         
          <ListItem
            title={item.senderId===this.state.user.id?item.recieverName:item.senderName}
            subTitle={this.renderMessage(item.lastMessage)}
            image={{uri:item.senderId===this.state.user.id?item.recieverProfileImage:item.senderProfileImage}}
            onPress={() => this.props.navigation.navigate('Conversation',{item:item})}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => this.handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={this.state.refreshing}
        ListEmptyComponent = {()=>{
          return(
          <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:50}}>
          <Text style={{color:'black',textAlign:'center'}}>No messages are available</Text>
          </View>
          )
        }}
        onRefresh={() => {
          setMessages([
            {
              id: 2,
              title: "T2",
              description: "D2",
              image: require("../assets/pic.jpg"),
            },
          ]);
        }}
      />
  }
    </Screen>
  );
      }
}

const styles = StyleSheet.create({});

export default MessagesScreen;
