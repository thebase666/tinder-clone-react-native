import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react'
import { Button, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import useAuth from '../hooks/useAuth';


const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);//相当于在Stack.Screen中加入options={{ headerShown: false }}

  return (
    <View style={styles.container}>
      {/* 外面container必须定义 否则不显示 */}
      <ImageBackground
        resizeMode='cover'
        style={styles.background}
        source={{ uri: "https://tinder.com/static/tinder.png" }}>
        <View style={styles.signInContainer}>
          <TouchableOpacity style={styles.TouchableOpacity} onPress={signInWithGoogle} >
            <Text style={styles.text} >Sign in</Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>

    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  background: {
    flex: 1,
    justifyContent: "center"
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
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',

  }
})



