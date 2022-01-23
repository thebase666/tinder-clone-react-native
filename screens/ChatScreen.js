import { Button, Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import useAuth from '../hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, query, where, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';
import ChatRow from '../components/ChatRow';
import tw from 'twrnc';

const ChatScreen = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(() =>
    onSnapshot(query(collection(db, "matches"), where("userMatched", "array-contains", user.uid)),
      (snapshot) =>
        setMatches(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })))
    ), [user]);

  return matches.length > 0 ? (
    <FlatList
      style={tw`h-full`}
      data={matches}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View>
      <Text>No match</Text>
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})
