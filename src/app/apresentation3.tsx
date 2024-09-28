import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Apresentation3({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const handleFinish = async () => {
    try {
      // Define o valor para indicar que as telas de apresentação foram vistas
      await AsyncStorage.setItem('hasSeenIntroduction', 'true');
      // Navega para a tela de login
      router.replace("/login");
    } catch (error) {
      console.error('Erro ao definir o estado de introdução:', error);
    }
  };

  if (!fontsLoaded) {
    return null; // Ou um componente de carregamento, se preferir
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        style={styles.logo}
        source={require('./logo.png')}
      />
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>A nossa </Text>
          <Text style={styles.highlightedText}>missão
            <Text style={styles.welcomeText}> é</Text>
          </Text>
          <Text style={styles.paragraphText}>Te
            <Text style={styles.highlightedParagraphText}> auxiliar financeiramente 
            </Text> com acessibilidade, simplicidade e segurança para tornar a sua experiência e a dos seus parceiros mais eficiente. 
          </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleFinish}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressInactive}></View>
          <View style={styles.progressInactive}></View>
          <View style={styles.progressActive}></View>
        </View>
        <TouchableOpacity
          onPress={handleFinish}
        >
          <Text style={styles.skipText}>Pular apresentação</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1C2120',
    },
    logo: {
      height: 50,
      width: 50,
      resizeMode: 'contain',
      alignSelf: 'flex-end',
      marginTop: 100,
      marginRight: 26,
    },
    textContainer: {
      marginTop: 30,
      marginLeft: 20,
    },
    welcomeText: {
      fontSize: 44,
      color: '#FFF',
      fontFamily: 'Poppins_700Bold',
      lineHeight: 64, // Ajusta a altura da linha
    },
    highlightedText: {
      fontSize: 44,
      color: '#4bd5f1',
      fontFamily: 'Poppins_700Bold',
      lineHeight: 44, // Ajusta a altura da linha
    },
    paragraphText: {
      fontSize: 24,
      color: '#FFF',
      fontFamily: 'Roboto_400Regular',
    },
    highlightedParagraphText: {
      fontSize: 24,
      color: '#4bd5f1',
      fontFamily: 'Roboto_700Bold',
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
    },
    buttonText: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 14,
    },
    progressContainer: {
      flexDirection: 'row',
      marginTop: 20,
      marginBottom: 10,
    },
    progressActive: {
      height: 5,
      width: 80,
      backgroundColor: '#4bd5f1',
      marginHorizontal: 2,
      borderRadius: 5,
    },
    progressInactive: {
      height: 5,
      width: 80,
      backgroundColor: '#A9A9A9',
      marginHorizontal: 2,
      borderRadius: 5,
    },
    skipText: {
      color: '#A9A9A9',
      marginTop: 10,
      fontFamily: 'Roboto_400Regular',
      fontSize: 12,
      textDecorationLine: 'underline',
    },
  });