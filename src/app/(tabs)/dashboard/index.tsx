import { useNavigation, useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../../../config/firebase';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import Entypo from '@expo/vector-icons/Entypo';
import { ProgressCircle } from 'react-native-svg-charts';
import { Svg, Text as SvgText } from 'react-native-svg'; // Adicione a importação de Svg
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
    const [saldo, setSaldo] = useState(null); // Estado para o saldo
    const [isSaldoOculto, setIsSaldoOculto] = useState(true); // Estado para controle do saldo oculto/visível

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
                    const firstName = userData.name.split(' ')[0]; // Pega apenas o primeiro nome
                    setUserName(firstName);
                }
            }
        };

        // Função para buscar o saldo do Firebase
        const fetchSaldo = async () => {
            const db = getFirestore();
            const user = auth.currentUser;

            if (user) {
                const saldoRef = doc(db, 'users', user.uid);
                const saldoSnap = await getDoc(saldoRef);

                if (saldoSnap.exists()) {
                    const saldoData = saldoSnap.data().balance; // Supondo que o campo seja 'balance'
                    setSaldo(saldoData);
                }
            }
        };

        fetchUserName();
        fetchSaldo();
    }, []);

    // Função para alternar visibilidade do saldo
    const toggleSaldoVisibilidade = () => {
        setIsSaldoOculto(!isSaldoOculto);
    };

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
                                {/* Mostra o saldo se não estiver oculto, caso contrário mostra '*******' */}
                                <Text style={styles.hiddenText}>
                                    {isSaldoOculto ? '*******' : saldo !== null ? `R$ ${saldo}` : 'Carregando...'}
                                </Text>

                                {/* Botão para alternar a visibilidade do saldo */}
                                <TouchableOpacity
                                    style={{ marginLeft: '20%', marginTop: -12 }}
                                    onPress={toggleSaldoVisibilidade} // Chama a função ao clicar
                                >
                                    {/* Ícone de olho ou olho com linha dependendo do estado */}
                                    <Entypo
                                        name={isSaldoOculto ? "eye-with-line" : "eye"}
                                        size={24}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.learnMoreButton, { transform: [{ rotate: '3deg' }] }]} onPress={() => router.push('/(tabs)/saldo')}>
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
    const percentage = Math.round(progress * 100); // Calcule a porcentagem aqui

    return (
        <View style={styles.goalItem}>
            {/* ProgressCircle e o texto dentro dele */}
            <Svg height={40} width={40}>
                <ProgressCircle
                    style={{ height: 40, width: 40 }}
                    progress={progress}
                    progressColor={'rgb(134, 65, 244)'}
                />
                {/* Texto centralizado (número + %) */}
                <SvgText
                    x="53%"
                    y="50%"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="10"
                    fill="black"
                >
                    {`${percentage}%`}
                </SvgText>
            </Svg>

            {/* Container para as informações da meta */}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    goalInfo: {
        flexDirection: 'column',
    },
    goalLabel: {
        fontSize: 16,
        color: '#000',
        marginLeft: -130,
    },
    goalRemaining: {
        fontSize: 14,
        color: '#000',
        marginLeft: -130,
    },
    chevron: {
        fontSize: 30,
        color: '#000000',
    },
});