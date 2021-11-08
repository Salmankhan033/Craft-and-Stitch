import * as firebase from 'firebase';
import 'firebase/firestore';


export const loginUser = (email,password) =>{
    return firebase.auth().signInWithEmailAndPassword(email,password)
}

export const registerUser = (email,password)=>{
return firebase.auth().createUserWithEmailAndPassword(email,password)
}

export const addUser = (data,id) =>{
    
    return firebase.firestore().collection("users").doc(id).set({...data})
}

export const getUser = (email)=>{
    return firebase.firestore().collection('users').where('email','==',email).get()
}

export  const uploadImageAsync=async(url) =>{
    const response = await fetch(url);
  const blob = await response.blob();
  const ref = firebase
      .storage()
      .ref()
      .child(`/posts/${Date.now()}`)
      const snapshot = await ref.put(blob);
      return await snapshot.ref.getDownloadURL();    
  }

  export  const uploadProfileImage=async(url) =>{
    const response = await fetch(url);
  const blob = await response.blob();
  const ref = firebase
      .storage()
      .ref()
      .child(`/accounts/${Date.now()}`)
      const snapshot = await ref.put(blob);
      return await snapshot.ref.getDownloadURL();    
  }

  export const addPost = (data) =>{
    return firebase.firestore().collection("posts").doc().set({...data})
}

export const getPosts = ()=>{
    return firebase.firestore().collection('posts').get()
}

export const getMyPosts = (id)=>{
    return firebase.firestore().collection('posts').where('user.id','==',id).get()
}