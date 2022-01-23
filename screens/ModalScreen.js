import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ModalScreen = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const navigation = useNavigation();

  const updateProfile = () => {//setdoc操作数据库返回promise
    setDoc(doc(db, 'user', user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      }).catch((err) => {
        alert(err.message);
      });
  };

  return (
    <View style={styles.screen}>
      <Image style={styles.logo} resizeMode='contain' source={require("../logo.png")} />

      <Text style={{ color: "gray", fontWeight: "bold" }} >Welcome {user.displayName} </Text>

      <Text style={{ padding: 16, color: "red" }} >Step: 1 The Profile Pic</Text>
      <TextInput value={image} onChangeText={(text) => setImage(text)}
        placeholder='Enter your imageurl' style={{ paddingBottom: 10 }} />

      <Text style={{ padding: 16, color: "red" }} >Step: 2 The Job</Text>
      <TextInput value={job} onChangeText={(text) => setJob(text)}
        placeholder='Enter your job' style={{ paddingBottom: 10 }} />

      <Text style={{ padding: 16, color: "red" }} >Step: 2 The Age</Text>
      <TextInput
        maxLength={2} keyboardType='numeric'
        value={age} onChangeText={setAge}
        // onChangeText={(text) => setAge(text)} 可简化成上面写法
        placeholder='Enter your age' style={{ paddingBottom: 10 }} />

      <View style={styles.signInContainer}>
        <TouchableOpacity style={styles.TouchableOpacity}
          onPress={updateProfile}
          disabled={!job || !age || !image} >
          <Text style={styles.text} >Upload</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  logo: {
    height: 80,
    width: 80,
  },
  screen: {
    height: '100%',
    width: '100%',
    backgroundColor: "white",
    alignItems: 'center',
  },
  signInContainer: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
  },
  TouchableOpacity: {
    height: 60,
    // position: 'absolute',
    // bottom: 150,
    // width: '100%',
    marginHorizontal: "25%",//水平居中
    // marginLeft: 100,
    // marginRight: 100,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',

  }

});
