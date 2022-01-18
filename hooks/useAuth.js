import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Google from 'expo-google-app-auth';
//配置google控制台 不用新建项目 直接搜索firebase的项目就可以 
//firebase文件用的还是web的config
import {
  GoogleAuthProvider,//用expo-google-app-auth登录后把idToken, accessToken拿出来创建fierbaseauth的credential
  onAuthStateChanged,//onAuthStateChanged是listener 监听用户状态
  signInWithCredential,//在firebaseauth完成登录 同时传用户数据 
  signOut//给auth参数 在firebaseauth退出登录 也相当于在谷歌退出 因为谷歌控制台用的就是firebase的项目
} from "@firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext({});

const config = {
  androidClientId: "218055958127-bkfh0r8uhre897fk6lgb89dvubf6vdns.apps.googleusercontent.com",
  iosClientId: '218055958127-3hgbrtv910u30932ht6v29pkopengno4.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  permissions: ["public_profile", "email", "gender", "location"]
};


export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    setLoadingInitial(false);
  }), []);//onAuthStateChanged是listener 载入就要连接firebase用firebase的auth建立侦听 否则不显示页面

  const logout = () => {
    setLoading(true);
    signOut(auth).catch((error) => setError(error)).finally(() => setLoading(false));
  };


  const signInWithGoogle = async () => {
    setLoading(true);

    await Google.logInAsync(config)//就在这用了'expo-google-app-auth给参数就登录了  是promise
      .then(async (logInResult) => {//其他都用的firebase的auth进行用户状态跟踪
        if (logInResult.type === "success") {
          const { idToken, accessToken } = logInResult;//登录后把idToken, accessToken拿出来创建fierbaseauth的credential
          const credential = GoogleAuthProvider.credential(idToken, accessToken);//创建fierbaseauth的credential
          await signInWithCredential(auth, credential);//在firebaseauth完成登录 同时传用户数据 
        }//
        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({ user, loading, error, logout, signInWithGoogle }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider
      value={memoedValue}
    >
      {/* user: user, 可缩写成user,   研究下这个位置参数转换 firebaseaauth的函数 
      signInWithGoogle是函数 也相当于signInWithGoogle:signInWithGoogle, */}
      {!loadingInitial && children}
      {/* 没有这句所有页面消失 //onAuthStateChanged是listener 
      载入就要连接firebase用firebase的auth建立侦听 否则不显示页面 */}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext);
}
//useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化
// 。你仍然需要在上层组件树中使用 <MyContext.Provider> 来为下层组件提供 context。
//相当于redux recoil 全局传参
const styles = StyleSheet.create({})
