import { useNavigation, useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../../../config/firebase';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import Entypo from '@expo/vector-icons/Entypo';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Platform,
    ScrollView,
} from 'react-native';

export default function HomeScreen() {

    const [userName, setUserName] = useState('');

    const navigation = useNavigation();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
        Roboto_400Regular,
        Roboto_700Bold,
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

    return (
        <ScrollView>
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1c2120" />
            {/* Top Section - User Info */}
            <View style={styles.userInfoContainer}>
                <View style={styles.userText}>
                    <Text style={styles.greetingText}>
                        Olá, <Text style={styles.nameText}>{userName}</Text>
                    </Text>
                    <Text style={styles.subText}>É bom te ter de volta</Text>
                </View>
                <Image
                    source={{ uri: 'https://placehold.co/50x50' }}
                    style={styles.userImage}
                />
            </View>

            <View style={styles.container1}>
                {/* Card Section */}
                <LinearGradient
                    colors={['#5d3fd3', '#d9f0ff']}
                    style={[styles.cardContainer, { transform: [{ rotate: '-3deg' }] }]}
                >
                    <View style={[styles.overlay, { transform: [{ rotate: '3deg' }] }]} />
                    <Text style={[styles.cardText, { transform: [{ rotate: '3deg' }] }]}>Saldo atual</Text>
                    <View style={[styles.balanceContainer, { transform: [{ rotate: '3deg' }] }]}>
                        <View style={styles.hiddenBalance}>
                            <Text style={styles.hiddenText}>*******</Text>
                            <TouchableOpacity style={{ marginLeft: '20%', marginTop: -12 }}>
                                <Entypo name="eye-with-line" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.learnMoreButton, { transform: [{ rotate: '3deg' }] }]}>
                        <Text style={styles.learnMoreText}>Saiba mais</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Groups Section */}
                <View style={styles.groupsContainer}>
                    {/* Container para o título e o botão de criar grupo */}
                    <View style={styles.groupsHeader}>
                        <Text style={styles.sectionTitle}>Seus Grupos</Text>
                        <TouchableOpacity>
                            <Text style={styles.createText}>+ Criar grupo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Grupos listados */}
                    <View style={styles.groupsRow}>
                        <GroupItem label="Casa" />
                        <GroupItem label="Casal" />
                        <GroupItem label="Faculdade" />
                    </View>
                </View>

                {/* Goals Section */}
                <View style={styles.goalsContainer}>
                    <View style={styles.goalsHeader}>
                        <Text style={styles.sectionTitle}>Metas</Text>
                        <TouchableOpacity>
                            <Text style={styles.createText}>+ Criar meta</Text>
                        </TouchableOpacity>
                    </View>

                    <GoalItem
                        label="Viagem"
                        progress={0.5}
                        remaining="R$ 150 restantes"
                    />
                    <GoalItem
                        label="Casa"
                        progress={0.15}
                        remaining="R$ 10.000 restantes"
                    />
                </View>
            </View>
        </View>
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

function GoalItem({ label, progress, remaining }) {
    return (
        <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
                <Text style={styles.goalLabel}>{label}</Text>
                <Text style={styles.goalRemaining}>{remaining}</Text>
            </View>
            <TouchableOpacity>
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Ajuste de espaço para Android
    },
    container1: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        padding: 16,
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#1c2120',
        paddingBottom: 80,
        paddingTop: 50,
        paddingHorizontal: 30,
    },
    userText: {
        flexDirection: 'column',
    },
    greetingText: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'Poppins_700Bold'
    },
    nameText: {
        color: '#4bd5f1',
    },
    subText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Poppins_400Regular'
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc',
    },
    cardContainer: {
        backgroundColor: '#6246ea',
        borderRadius: 12,
        padding: 16,
        marginBottom: 54,
        borderColor: '#04172e',
        marginTop: -64,
    },
    overlay: {
        position: 'absolute', // Posiciona a View em cima do LinearGradient
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.25)', // Cor escura com 50% de opacidade
        borderRadius: 12, // Mesma borda para combinar com o container
    },
    cardText: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 8,
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hiddenBalance: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 15,
    },
    hiddenText: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Poppins_700Bold'
    },
    learnMoreButton: {
        backgroundColor: '#fff', // Fundo branco
        borderRadius: 8, // Bordas arredondadas
        paddingVertical: 8, // Espaçamento vertical
        paddingHorizontal: 4, // Espaçamento horizontal
        alignItems: 'center', // Centraliza o texto
        marginTop: 12, // Espaçamento acima do botão
    },
    learnMoreText: {
        color: '#6246ea', // Cor do texto
        fontSize: 16, // Tamanho do texto
        fontFamily: 'Poppins_700Bold', // Fonte em negrito
    },
    groupsContainer: {
        marginBottom: 24,
    },
    groupsHeader: {
        flexDirection: 'row', // Coloca o título e o botão na mesma linha
        justifyContent: 'space-between', // Garante que o botão vá para a direita
        alignItems: 'center', // Centraliza verticalmente o texto e o botão
        marginBottom: 16, // Espaçamento abaixo da linha
    },
    sectionTitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        fontFamily: 'Poppins_700Bold',
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
    groupIcon: {
        width: 30, // Tamanho da imagem dentro do círculo
        height: 30,
    },
    groupLabel: {
        fontSize: 12,
        color: '#000000',
        fontFamily: 'Poppins_400Regular'
    },
    createText: {
        color: '#000000',
        fontFamily: 'Poppins_400Regular'
    },
    goalsContainer: {
        marginBottom: 24,
    },
    goalsHeader: {
        flexDirection: 'row', // Coloca o título e o botão na mesma linha
        justifyContent: 'space-between', // Garante que o botão vá para a direita
        alignItems: 'center', // Centraliza verticalmente o texto e o botão
        marginBottom: 12, // Espaçamento abaixo da linha
    },
    goalItem: {
        backgroundColor: '#00CFFD',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    goalInfo: {
        flexDirection: 'column',
    },
    goalLabel: {
        fontSize: 16,
        color: '#000',
    },
    goalRemaining: {
        fontSize: 14,
        color: '#000',
    },
    progressBar: {
        height: 6,
        width: '50%',
        marginVertical: 8,
    },
    chevron: {
        fontSize: 30,
        color: '#000000',
    },
});