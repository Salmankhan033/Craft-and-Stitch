import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { MyStorage } from "../helper/storage";
import { StackActions } from '@react-navigation/native';


const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary, 
    },
    targetScreen: routes.MYLISTINGS,

  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.MESSAGES,
  },
];

class AccountScreen extends React.Component {
  constructor(){
    super()
    this.state={
      user:null
    }
  }
  componentDidMount = ()=>{
    new MyStorage().getUserData()
    .then(user=>{
      if(user){
        
        this.setState({user:JSON.parse(user)})
      }
      
    })
    .catch(err=>{
      console.log('error in getting user is: ',err)
    })
  }

  render(){
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={this.state.user ? this.state.user.name:'Full Name'}
          subTitle={this.state.user?this.state.user.email:"***@***.com"}
          image={{uri:this.state.user?this.state.user.profileImage:'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'}}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => this.props.navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
      <ListItem
        onPress={()=>{
          new MyStorage().removeUserData()
          this.props.navigation.dispatch(
            StackActions.replace('Welcome')
          );
        }}
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
      />
    </Screen>
  );
      }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
