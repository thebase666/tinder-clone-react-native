import { useNavigation } from '@react-navigation/native'
// import { useNavigation } from '@react-navigation/core'视频是这个
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import useAuth from '../hooks/useAuth';
import React, { useLayoutEffect, useRef } from 'react';
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const USER_DATA = [
    {
      id: 123,
      age: "25",
      name: "Element1",
      job: "Software dev",
      photoUrl: "https://i0.hdslb.com/bfs/article/ab442ab83237140a771ea6a740e7835b6d7bb8e2.jpg@942w_927h_progressive.webp"
    },
    {
      id: 456,
      age: "26",
      name: "Element2",
      job: "Software dev",
      photoUrl: "https://i0.hdslb.com/bfs/article/c93cbc641f5b90737f8c036eebc8d3e9eadcc0e8.jpg@942w_941h_progressive.webp"
    },
    {
      id: 789,
      age: "27",
      name: "Element3",
      job: "Software dev",
      photoUrl: "http://touxiangkong.com/uploads/allimg/2021100214/qh25mo2xmom.jpg"
    },
    {
      id: 7,
      age: "27",
      name: "Element3",
      job: "Software dev",
      photoUrl: "http://touxiangkong.com/uploads/allimg/2021100214/qh25mo2xmom.jpg"
    },
    {
      id: 8,
      age: "27",
      name: "Element3",
      job: "Software dev",
      photoUrl: "http://touxiangkong.com/uploads/allimg/2021100214/qh25mo2xmom.jpg"
    },
    {
      id: 9,
      age: "27",
      name: "Element3",
      job: "Software dev",
      photoUrl: "http://touxiangkong.com/uploads/allimg/2021100214/qh25mo2xmom.jpg"
    }


  ]

  return (
    <View style={styles.screen}>
      <View style={styles.header} >
        <TouchableOpacity style={styles.userpictureTouch} onPress={logout}>
          {/* onPress放在TouchableOpacity中 不放在image中 */}
          <Image style={styles.userpicture} source={{ uri: user.photoURL }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoTouch}  >
          <Image style={styles.logo} source={require("../logo.png")} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")} >
          <Ionicons name="chatbubbles-sharp" size={32} color="#FF5864" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "white" }}//外面container有自定义的颜色
          cards={USER_DATA}
          stackSize={4}//下方显示的卡数 
          // cardIndex={0}
          // animateCardOpacity
          onSwipedLeft={() => { }}
          onSwipedRight={() => { }}
          verticalSwipe={false}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red',
                },
              },
            },
            right: {
              title: 'MATCH',
              style: {
                label: {
                  textAlign: 'left',
                  color: 'green',
                },
              },
            },
          }}

          renderCard={(card) => {
            return (
              <View key={card.id} style={styles.card} >
                <Image style={styles.cardImage} source={{ uri: card.photoUrl }} />
                <View style={styles.infobox}>
                  <View style={styles.namebox} >
                    <Text style={styles.text}>{card.name}</Text>
                    <Text style={styles.text2}>{card.job}</Text>
                  </View>
                  <Text style={styles.text}>{card.age}</Text>
                </View>

              </View>
            )
          }}
        >
        </Swiper>
      </View>

      <View style={styles.bottomIconContainer}>
        <TouchableOpacity style={styles.bottomIcon1} onPress={() => swipeRef.current.swipeLeft()} >
          <Entypo name='cross' size={24} color='red' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon2} onPress={() => swipeRef.current.swipeRight()} >
          <AntDesign name='heart' size={24} color='green' />
        </TouchableOpacity>
      </View>


    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
  },
  header: {
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  userpicture: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  logo: {
    height: 80,
    width: 80,
  },
  cardContainer: {
    flex: 1,//这个必须要给 否职不能滑动 
    backgroundColor: 'white',
    marginTop: -10,
  },
  card: {
    height: 500,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "white",
    position: 'relative',
  },
  cardImage: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: '100%',
    borderRadius: 20,
  },
  infobox: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    padding: 10,
    shadowColor: "red",//卡的shadow用infobox定义的 有点难 
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  text2: {
    fontSize: 15,
  },
  bottomIconContainer: {
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',//这个高级
    backgroundColor: 'white',
  },
  bottomIcon1: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    height: 60,
    width: 60,
    backgroundColor: '#FFB6C1',
  },
  bottomIcon2: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    height: 60,
    width: 60,
    backgroundColor: '#00FF00',
  }
})

