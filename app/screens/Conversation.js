import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import * as firebase from 'firebase';
import 'firebase/database';
import Screen from "../components/Screen";
import colors from "../config/colors";
import {
    ListItem,
    ListItemDeleteAction,
    ListItemSeparator,
} from "../components/lists";
import { MyStorage } from "../helper/storage";
import { render } from "react-dom";
import { MaterialCommunityIcons } from "@expo/vector-icons";


class Conversation extends React.Component {
    constructor() {
        super()
        this.state = {
            user: null,
            fetching: true,
            messages: [],
            refreshing: false,
            messageText: ''
        }
    }


    componentDidMount = () => {
        new MyStorage().getUserData()
            .then(user => {
                if (user) {
                    this.setState({ user: JSON.parse(user) }, () => {
                        console.log('props are: ', this.props)
                        this.fetchMessages(user)
                    })

                }

            })
            .catch(err => {
                console.log('error in getting user data is: ', err)
                Alert.alert('Error', 'Something went wrong please restart the app')
            })
    }
    componentWillUnmount = () => {
        firebase.database()
            .ref(`/messages/${this.props.route.params.item.key}`)
            .off('value', this.onValueChange);
    }


    fetchMessages = () => {
        firebase.database()
            .ref(`/messages/${this.props.route.params.item.key}`)
            .on('value', this.onValueChange)

    }

    onValueChange = (snapshot) => {
        if (snapshot.val()) {
            let data = snapshot.val()
            let keys = Object.keys(data)
            let tempChats = keys.map(key => {
                return { ...data[key], key }
            })
            tempChats = tempChats.sort((a, b) => {
                return a.createdAt >b.createdAt
            })
            this.setState({ fetching: false, messages: tempChats })
        }
        else {
            this.setState({ fetching: false })
        }
    }



    renderItem = (item) => {

        return (
            <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
                {item.senderId === this.state.user.id ?

                    <View style={styles.providerContainer}>


                        <Text style={{ fontSize: 13, color: 'black' }} >{item.message}</Text>

                        <View style={styles.providerMsgArrow}></View>
                    </View>

                    :
                    <View style={styles.seekerContainer}>


                        <Text style={{ fontSize: 13, color: 'black' }} >{item.message}</Text>

                        <View style={styles.seekerMsgArrow}></View>
                    </View>
                }
            </View>
        )
    }


    sendMessage = ()=>{
        
   
      let data = {
        message:this.state.messageText,
        searching:`${this.props.route.params.item.key}`,
        senderId:this.state.user.id,
        recieverId:this.props.route.params.item.senderId===this.state.user.id?this.props.route.params.item.recieverId:this.props.route.params.item.senderId,
        id:Date.now(),
        createdAt:Date.now(),
        isRead:false,
        isSaw:false
      }
      firebase.database()
      .ref(`/chats/${this.props.route.params.item.key}`)
      .update({
        lastMessage:this.state.messageText,
        createdAt:Date.now(),
      })
      .then(()=>{
       firebase.database()
        .ref(`/messages/${this.props.route.params.item.key}`)
        .push({
         ...data
        })
        .then(()=>{
         
          this.setState({messageText:false})
        })
        .catch(err=>{
          console.log('error in adding messages is: ',err)
          this.setState({messageText:false})

          Alert.alert('Error','Something went wrong please try again')
        })
        
        
      })
      .catch(err=>{
        console.log('error in chats is: ',err)
        this.setState({messageText:false})

        Alert.alert('Error','Something went wrong please try again')
      })
    }

    render() {
        // console.log('hcats are: ',this.state.chats)
        return (
            <View style={{ flex: 1 }} >
                {this.state.fetching ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <ActivityIndicator color='black' size={'large'} />
                    </View>
                    :
                    <FlatList
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flex: 1 }}
                        data={this.state.messages}
                        keyExtractor={(message) => message.key}
                        renderItem={({ item }) => (
                            this.renderItem(item)
                        )}
                        // ItemSeparatorComponent={ListItemSeparator}
                        refreshing={this.state.refreshing}
                        ListEmptyComponent={() => {
                            return (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ color: 'black', textAlign: 'center' }}>No messages are available</Text>
                                </View>
                            )
                        }}
                    />

                }
                <View style={{ marginBottom: 20,flexDirection:'row' }}>
                    <View style={{ flex: 1, marginHorizontal: 20, justifyContent: 'center' }}>
                        <TextInput
                            style={{ marginBottom: 0, paddingBottom: 0, height: 40, padding: 15, fontSize: 17, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, color: 'black' }}
                            placeholder='Type message'
                            placeholderTextColor='gray'
                            multiline={true}
                            value={this.state.messageText}
                            onChangeText={(text) => { this.setState({ messageText: text }) }}
                        />
                    </View>
                    <View style={{ marginRight: 20, justifyContent: 'center' }}>
                        <TouchableOpacity
                        onPress={() => {
                            this.sendMessage()
                        }}
                        >
                            <MaterialCommunityIcons
                                color={colors.primary}
                                name="send"
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    seekerContainer: {
        padding: 7,

        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        minWidth: 100,
        maxWidth: 300,
        alignSelf: 'flex-start',
        backgroundColor: '#f5f5f5',
        position: 'relative'
    },
    seekerMsgArrow: {
        position: 'absolute',
        top: 0,
        left: -10,
        zIndex: 2,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderRightWidth: 10,
        borderTopColor: '#f5f5f5',
        borderBottomColor: 'transparent',
        borderRightColor: '#f5f5f5'

    },

    providerContainer: {
        padding: 7,

        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        minWidth: 100,
        maxWidth: 300,
        alignSelf: 'flex-end',
        backgroundColor: '#ffe0b2',
        position: 'relative'
    },
    providerMsgArrow: {
        position: 'absolute',
        top: 0,
        right: -10,
        zIndex: 2,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderLeftWidth: 10,
        borderTopColor: '#ffe0b2',
        borderBottomColor: 'transparent',
        borderLeftColor: '#ffe0b2'

    },

});

export default Conversation;
