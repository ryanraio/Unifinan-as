import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function Login() {
  // Carregamento das fontes
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Roboto_400Regular,
  });

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const db = getFirestore();

  // Função para submissão do formulário
  const handleSubmit = async () => {
    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          await AsyncStorage.setItem('userName', userData.name);
          await AsyncStorage.setItem('isUserLoggedIn', 'true'); 
          router.replace('/dashboard'); 
        }
      } catch (err) {
        console.log('got error: ', err.message);
        Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais e tente novamente.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  const handleResetIntro = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenIntroduction');
      router.replace('/apresentation1');
    } catch (error) {
      console.error('Erro ao redefinir o estado de introdução:', error);
    }
  };

  if (!fontsLoaded) {
    return <Text style={styles.loadingText}>Carregando fontes...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Bem vindo de volta</Text>
        <Text style={styles.titleText}>Insira o seu e-mail e sua senha</Text>
        <Text style={styles.titleText}>para entrar no seu perfil</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.header}>E-MAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.header}>SENHA</Text>
        <TextInput
          style={styles.input}
          placeholder="*****"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.button}
          onPress={handleResetIntro}
        >
          <Text style={styles.buttonText}>Resetar Introdução</Text>
        </TouchableOpacity> */}
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.skipTextT}>Não tem uma conta?</Text>
          <Text style={styles.skipText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textContainer: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 110,
  },
  welcomeText: {
    fontSize: 28,
    color: 'black',
    fontFamily: 'Poppins_700Bold',
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'justify',
  },
  formContainer: {
    marginHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4bd5f1',
    padding: 10,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10, // Adiciona um espaço entre os botões
  },
  buttonText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#000',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipText: {
    color: '#3b0050',
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  skipTextT: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
  },
  header: {
    fontSize: 12,
    marginBottom: 3,
    fontFamily: 'Roboto_400Regular',
    marginLeft: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
  },
  loadingText: {
    color: '#000',
    fontSize: 16,
    marginTop: 20,
  },
});
