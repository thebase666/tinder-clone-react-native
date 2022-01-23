import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StyleSheet, Text, View } from 'react-native'
import useAuth from './hooks/useAuth';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import ModalScreen from './screens/ModalScreen';
import MatchScreen from './screens/MatchScreen';
import MessageScreen from './screens/MessageScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();// 函数 用useAuth()取值 useAuth()在useAuth文件中把字典套入
  // user已经传递到class组件的{this.context}中了 不容易取 需要static contextType = ThemeContext; 

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            {/* modal 不是下方弹出的 可能安卓设置不了 */}
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>

          <Stack.Group >
            {/* 这个能显示 高级 */}
            <Stack.Screen name="Match" component={MatchScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})
