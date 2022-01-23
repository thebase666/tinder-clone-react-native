import { useNavigation } from '@react-navigation/native'
// import { useNavigation } from '@react-navigation/core'视频是这个
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import useAuth from '../hooks/useAuth';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, getDocs, onSnapshot, query, where, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);
  const [profiles, setProfiles] = useState([]);

  useLayoutEffect(() =>
    onSnapshot(doc(db, "user", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    }), []);//onSnapshot取数据 且侦听 得到的结果给snapshot

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(collection(db, "user", user.uid, "passes")).then(
        (snapshot) => snapshot.docs.map((doc) => doc.id)
      );
      const passedUserIds = passes.length > 0 ? passes : ["test"];

      const swipes = await getDocs(collection(db, "user", user.uid, "swipes")).then(
        (snapshot) => snapshot.docs.map((doc) => doc.id)
      );
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];
      // console.log([...passedUserIds, ...swipedUserIds]);

      unsub = onSnapshot(query(collection(db, "user"),
        where("id", "not-in", [...passedUserIds, ...swipedUserIds])),
        (snapshot) => {
          setProfiles(snapshot.docs
            .filter((doc) => doc.id !== user.uid)
            .map((doc) => ({ id: doc.id, ...doc.data(), }))//太高级了 
          );
        });
      // console.log(profiles);
    };
    fetchCards();
    return unsub;
  }, []);


  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    setDoc(doc(db, "user", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    setDoc(doc(db, "user", user.uid, "swipes", userSwiped.id), userSwiped);

    const loggedInProfile = await (await getDoc(doc(db, "user", user.uid))).data();
    // console.log(loggedInProfile);//用两个await 否则卡住程序出问题 
    getDoc(doc(db, "user", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,//firebase里object的key用中括号
              [userSwiped.id]: userSwiped,
            },
            userMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          navigation.navigate("Match", {
            loggedInProfile, userSwiped,
          });
        }
      }
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header} >
        <TouchableOpacity style={styles.userpictureTouch} onPress={logout}>
          {/* onPress放在TouchableOpacity中 不放在image中 */}
          <Image style={styles.userpicture} source={{ uri: user.photoURL }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoTouch} onPress={() => navigation.navigate("Modal")} >
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
          cards={profiles}
          stackSize={5}//下方显示的卡数 
          cardIndex={0}
          animateCardOpacity
          onSwipedLeft={(cardIndex) => { swipeLeft(cardIndex); }}
          onSwipedRight={(cardIndex) => { swipeRight(cardIndex); }}
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

          renderCard={(card) => card ? (
            <View key={card.id} style={styles.card} >
              <Image style={styles.cardImage} source={{ uri: card.photoURL }} />
              <View style={styles.infobox}>
                <View style={styles.namebox} >
                  <Text style={styles.text}>{card.displayName}</Text>
                  <Text style={styles.text2}>{card.job}</Text>
                </View>
                <Text style={styles.text}>{card.age}</Text>
              </View>

            </View>
          ) : (
            <View style={styles.card}>
              <Image style={styles.cardImageNo} resizeMode='contain' source={require("../emoji.jpg")} />
              <View style={styles.infobox}>
                <Text style={styles.text}>No more profiles</Text>
              </View>
            </View>
          )
          }

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
    alignItems: "center",
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
  cardImageNo: {
    position: "absolute",
    top: 100,
    height: "60%",
    width: '60%',
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

