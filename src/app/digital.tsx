import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Font from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { router } from 'expo-router';

export default function Digital() {
  const navigation = useNavigation();

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se com biometria',
        fallbackLabel: 'Usar senha',
      });

      if (result.success) {
        router.replace("/dashboard"); // Redireciona para as tabs principais
      } else {
        alert('Autenticação falhou, tente novamente.');
      }
    } catch (error) {
      console.error('Erro na autenticação biométrica: ', error);
    }
  };

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Roboto_400Regular,
  });

  if (!fontsLoaded) {
    return null; // Ou um componente de carregamento, se preferir
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1c2120" />
      <View style={styles.logoContainer}>
        <Image
          source={require('./logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.fingerprintContainer}>
        <Image
          source={require('./digital.png')}
          style={styles.fingerprint}
        />
        <Text style={styles.title}>
          Use o Touch ID para
        </Text>
        <Text style={styles.title}>
          acessar o aplicativo
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleBiometricAuth}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.skipText}>Entrar com Email e Senha</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c2120',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
  fingerprintContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprint: {
    height: 150,
    width: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: '#4bd5f1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#000',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipText: {
    color: '#fff',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  skipTextT: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
  },
});
