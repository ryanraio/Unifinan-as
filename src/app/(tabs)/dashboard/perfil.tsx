import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { auth } from '../../../../config/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';



export default function ProfileScreen() {
  const [userName, setUserName] = useState('');

  const navigation = useNavigation();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Roboto_700Bold,
    Roboto_400Regular,
  });

  useEffect(() => {
    const fetchUserName = async () => {
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name);
        }
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('isUserLoggedIn');
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao sair: ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/editar_dados')}>
              <Text style={styles.editInfoText}>Editar informações pessoais</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.container1}>
        {/* Card Section */}
        <TouchableOpacity onPress={() => router.push('/(tabs)/premium')}>
          <LinearGradient colors={['#5d3fd3', '#d9f0ff']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.cardContainer}>
            <View style={styles.circle2}>
              <Image
                source={require('../../logo.png')}
                style={styles.iconEye}
              />
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={styles.cardText} numberOfLines={2}>
                Assine a <Text style={styles.cardText2}>UniFinanças Premium</Text>
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                para uma experiência completa
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.cardText1} numberOfLines={1}>›</Text>
            </TouchableOpacity>
            <View style={styles.balanceContainer}>
              <View style={styles.hiddenBalance}>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.groupsContainer}>
        {/* Container para o título e o botão de criar grupo */}
        <View style={styles.groupsHeader}>
          <Text style={styles.sectionTitle}>Seus Grupos</Text>
        </View>

        {/* Grupos listados */}
        <View style={styles.groupsRow}>
          <GroupItem label="Casa" />
          <GroupItem label="Casal" />
          <GroupItem label="Faculdade" />
        </View>
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.settings}>
          <TouchableOpacity style={styles.settingItem}>
            <AntDesign name="customerservice" size={24} color="black" />
            <Text style={styles.settingText}>Ajuda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color="black" />
            <Text style={styles.settingText}>Termos e condições de uso</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Encerrar Sessão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function GroupItem({ label }) {

  const groupImages = {
    Casa: require('./images/casa.png'),
    Casal: require('./images/casal.png'),
    Faculdade: require('./images/faculdade.png'),
  };

  return (
    <View style={styles.groupItem}>
      <View style={styles.circle}>
        <Image
          source={groupImages[label]}  // Mapeia o label para a imagem correta
          style={styles.groupIcon}      // Aplica o estilo para imagem circular
          resizeMode='contain'

        />
      </View>
      <Text style={styles.groupLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2120',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  profileContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 20,
    paddingBottom: 60,
    backgroundColor: '#1c2120',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  editInfoText: {
    color: '#fff',
    marginTop: 5,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  groupsContainer: {
    marginBottom: 24,
    padding: 16,
  },
  groupsHeader: {
    flexDirection: 'row', // Coloca o título e o botão na mesma linha
    justifyContent: 'space-between', // Garante que o botão vá para a direita
    alignItems: 'center', // Centraliza verticalmente o texto e o botão
    marginBottom: 8, // Espaçamento abaixo da linha
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  groupsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupItem: {
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25, // Deixa o container redondo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9d9d9', // Cor de fundo do círculo
  },
  circle2: {
    width: 40,
    height: 40,
    borderRadius: 25, // Deixa o container redondo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9d9d9', // Cor de fundo do círculo
    marginRight: 23,
  },
  groupIcon: {
    width: 30, // Tamanho da imagem dentro do círculo
    height: 30,
  },
  groupLabel: {
    fontSize: 12,
    color: '#000',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingItem: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  settingText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Roboto_700Bold',
    textAlign: 'center'
  },
  logoutButton: {
    backgroundColor: '#4bd5f1',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#000',
  },
  cardContainer: {
    flexDirection: 'row', // Itens em linha
    backgroundColor: '#fff', // Cor de fundo do botão
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15, // Bordas arredondadas
    alignItems: 'center', // Alinha itens verticalmente no centro
    minWidth: 250, // Largura mínima do botão para acomodar o ícone e o texto
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconEye: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginLeft: 5,
    textAlign: 'left',
    fontFamily: 'Poppins_400Regular',
  },
  cardSubtitle: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
    fontFamily: 'Poppins_400Regular',
  },
  cardText1: {
    color: '#fff',
    fontSize: 30,
    flex: 1,
    fontWeight: 'bold',
    marginLeft: 30,
    textAlign: 'left',
    marginTop: -2,
    fontFamily: 'Poppins_400Regular',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hiddenBalance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText2: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins_400Regular',
  },
});
