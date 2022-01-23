import { View, Text, TextInput, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from 'twrnc';
import { TouchableWithoutFeedback } from 'react-native-web';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() =>
    onSnapshot(query(collection(db, "matches", matchDetails.id, "messages"),
      orderBy("timestamp", "desc")),
      snapshot => setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    ), [matchDetails, db]);


  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });
    setInput("");
  };

  return (
    <View style={tw`flex-1`}>
      <Text>{getMatchedUserInfo(matchDetails?.users, user.uid).displayName}</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      // keyboardVerticalOffset={10}
      >

        <TouchableWithoutFeedback>
          <FlatList
            data={messages}
            inverted={-1}
            style={tw`pl-4 flex-1`}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
                // <Text>{message.id}</Text>
              ) : (
                <ReceiverMessage key={message.id} message={message} />
                // <Text>{message.id}</Text>
              )
            }
          />
        </TouchableWithoutFeedback>


        <View style={tw`flex-row justify-between items-center border-t border-gray-200 
      px-5 py-2`} >
          <TextInput style={tw`h-10 text-lg`}
            placeholder='Send Message'
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button onPress={sendMessage} title='Send' color="#FF5864" />
        </View>

      </KeyboardAvoidingView>
    </View>
  );
};

export default MessageScreen;
