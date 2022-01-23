import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';

const SenderMessage = ({ message }) => {
  return (
    <View style={(tw`bg-purple-600 rounded-lg px-5 py-3 mx-2 my-2 self-start ml-auto`)} >
      <Text style={tw`text-black`} >{message.message}</Text>
    </View>
  );
};

export default SenderMessage;
