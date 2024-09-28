import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [hasSeenIntroduction, setHasSeenIntroduction] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null); // Novo estado para verificar se o usuário está logado
  const router = useRouter();

  useEffect(() => {
    const checkAppState = async () => {
      try {
        const introStatus = await AsyncStorage.getItem('hasSeenIntroduction');
        setHasSeenIntroduction(introStatus);
  
        // Aqui está o problema:
        // Você está tentando buscar a chave 'user', mas na verdade salvou o estado de login como 'isUserLoggedIn'
        const userStatus = await AsyncStorage.getItem('isUserLoggedIn'); 
        setIsUserLoggedIn(userStatus === 'true'); // Certifique-se de que `isUserLoggedIn` seja booleano
  
        setLoading(false);
      } catch (error) {
        console.error('Erro ao verificar o estado do aplicativo:', error);
        setLoading(false);
      }
    };
  
    checkAppState();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Redireciona após 3 segundos
      const timer = setTimeout(() => {
        if (isUserLoggedIn) {
          router.replace('/digital'); // Redireciona para a tela de biometria se o usuário estiver logado
        } else if (hasSeenIntroduction === 'true') {
          router.replace('/login'); // Redireciona para a tela de login
        } else {
          router.replace('/apresentation1'); // Redireciona para a primeira tela de apresentação
        }
      }, 5000);

      // Limpa o timer se o componente for desmontado
      return () => clearTimeout(timer);
    }
  }, [loading, hasSeenIntroduction, isUserLoggedIn, router]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1c2120" />
      <Image
        style={{ height: 100, width: 100, resizeMode: 'contain' }}
        source={require('./logo.png')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2120',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
  },
});
