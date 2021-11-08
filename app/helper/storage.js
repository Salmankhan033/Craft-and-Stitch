import {AsyncStorage} from 'react-native';

export class MyStorage {

    user_data = 'USER_DATA'
  setItem(key, value) {
    return AsyncStorage.setItem(key, ''.concat(value));
  }

  getItem(key) {
    return AsyncStorage.getItem(key);
  }

  removeItem(key) {
    return AsyncStorage.removeItem(key);
  }

  setUserData(data) {
    this.setItem(this.user_data, data);
  }

  getUserData() {
    return this.getItem(this.user_data);
  }

  removeUserData() {
    return this.removeItem(this.user_data);
  }
}
