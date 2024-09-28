import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function App({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const router = useRouter();

  if (!fontsLoaded) {
    return null; // Ou um componente de carregamento, se preferir
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1c2120" />
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard/perfil')}>
          <Text style={styles.backButtonText}>{"X"}</Text>
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require('../logo.png')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Junte-se à </Text>
          <Text style={styles.highlightedText}>UniFinanças</Text>
          <Text style={styles.highlightedText}>Premium</Text>
          <Text style={styles.paragraphText}>
            Você pode ter a experiência completa com o plano
            <Text style={styles.highlightedParagraphText}> Premium</Text>!
          </Text>
        </View>
        <View style={styles.container1}>
          {/* Card Section */}
          <LinearGradient colors={['#5d3fd3', '#d9f0ff']}
            start={{ x: 0, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardContainer}>
            <Text style={styles.cardText} numberOfLines={1}>Benefícios Premium</Text>
            <Text style={styles.cardText1} numberOfLines={2}>✔ Integrantes em Grupos Ilimitados</Text>
            <Text style={styles.cardText1} numberOfLines={2}>✔ Anexo de Comprovantes</Text>
            <Text style={styles.cardText1} numberOfLines={2}>✔ Livre de Anúncios</Text>
            <Text style={styles.cardText3} numberOfLines={2}>Por Apenas
              <Text style={{ textDecorationLine: 'underline' }}> R$ 9,90/mês</Text>
            </Text>
          </LinearGradient>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.buttonText}>Assinar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2120',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Ajuste de espaço para Android
  },
  logo: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginTop: 20,
    marginRight: 30,
  },
  textContainer: {
    marginTop: 30,
    marginLeft: 20,
  },
  welcomeText: {
    fontSize: 30,
    color: '#FFF',
    fontFamily: 'Poppins_700Bold',
    lineHeight: 64, // Ajusta a altura da linha
  },
  highlightedText: {
    fontSize: 44,
    color: '#4bd5f1',
    fontFamily: 'Poppins_700Bold',
    lineHeight: 54, // Ajusta a altura da linha
  },
  paragraphText: {
    fontSize: 24,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  highlightedParagraphText: {
    fontSize: 24,
    color: '#4bd5f1',
    fontFamily: 'Poppins_700Bold',
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
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  container1: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#6A5ACD', // Cor de fundo do cartão
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15, // Bordas arredondadas
    minWidth: 250, // Largura mínima do botão para acomodar o ícone e o texto
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    textAlign: 'left',
    marginBottom: 10,
  },
  cardText1: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
    marginLeft: 5,
    marginBottom: 10,
    textAlign: 'left'
  },
  cardText3: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 5,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  backButton: {
    marginLeft: 30,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});
