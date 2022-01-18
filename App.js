import React from 'react';
import StackNavigator from './StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './hooks/useAuth';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();//忽略登录信息

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
//把tailwind转换成purecss
const styles = StyleSheet.create({

});
