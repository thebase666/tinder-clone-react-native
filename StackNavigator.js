import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StyleSheet, Text, View } from 'react-native'
import useAuth from './hooks/useAuth';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();// 函数 用useAuth()取值 useAuth()在useAuth文件中把字典套入
  // user已经传递到class组件的{this.context}中了 不容易取 需要static contextType = ThemeContext; 

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})
