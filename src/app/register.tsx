import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function Register() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Roboto_400Regular,
  });

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(''); // Novo estado para o telefone

  const db = getFirestore();

  const handleSubmit = async () => {

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (email && password && name) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          email: email,
          dateOfBirth: data,
          phone: phone, // Adiciona o telefone aos dados do usuário
        });

        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => router.push('/login'),
          },
        ]);
      } catch (err) {
        console.log('Erro: ', err.message);

        // Tratamento de erros do Firebase
        if (err.code === 'auth/weak-password') {
          Alert.alert('Erro', 'A senha é muito fraca. Escolha uma senha mais forte.');
        } else if (err.code === 'auth/email-already-in-use') {
          Alert.alert('Erro', 'Este e-mail já está em uso. Tente outro e-mail.');
        } else {
          Alert.alert('Erro', 'Ocorreu um erro ao registrar. Tente novamente.');
        }
      }
    } else {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
    }
  };

  // Função para formatar a data
  const handleDateChange = (text) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);

    if (match) {
      const formattedDate = [match[1], match[2], match[3]].filter(Boolean).join('/');
      setData(formattedDate);
    }
  };

  // Função para formatar o telefone
  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/\D/g, ''); // Remove tudo que não é número
    let formattedPhone = cleaned;

    if (cleaned.length > 2) {
      formattedPhone = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}`;
    }
    if (cleaned.length > 7) {
      formattedPhone = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }

    setPhone(formattedPhone);
  };

  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Crie uma conta</Text>
            <Text style={styles.titleText}>Cadastre-se em poucos minutos.</Text>
            <Text style={styles.titleText}>Preencha os Campos abaixo</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.header}>E-MAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={value => setEmail(value)}
            />
            <Text style={styles.header}>NOME COMPLETO</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o seu nome completo"
              value={name}
              onChangeText={value => setName(value)}
            />
            <Text style={styles.header}>DATA DE NASCIMENTO</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              value={data}
              onChangeText={handleDateChange}
              maxLength={10}
            />
            <Text style={styles.header}>NÚMERO DE CELULAR</Text>
            <TextInput
              style={styles.input}
              placeholder="(XX) XXXXX-XXXX"
              keyboardType="phone-pad"
              value={phone} // Adiciona o estado do telefone ao campo
              onChangeText={handlePhoneChange} // Chama a função de formatação
              maxLength={15} // Limita o número de caracteres
            />
            <Text style={styles.header}>SENHA</Text>
            <TextInput
              style={styles.input}
              placeholder="*****"
              secureTextEntry
              value={password}
              onChangeText={value => setPassword(value)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Cadastrar-se</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.skipTextT}>Já possui uma conta?</Text>
              <Text style={styles.skipText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 30,
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
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4bd5f1',
    padding: 10,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
  },
  skipButton: {
    marginTop: 10,
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
});
