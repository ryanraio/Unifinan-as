import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar, Alert, ScrollView, Platform } from 'react-native';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function EditInfo() {
    const [email, setEmail] = useState('');
    const [data, setData] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [userName, setUserName] = useState('');

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
        Roboto_400Regular,
    });

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

    // Função para buscar os dados do Firestore e preencher o formulário
    const fetchUserData = async () => {
        const userId = auth.currentUser?.uid; // Obtém o ID do usuário logado
        if (userId) {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setEmail(userData.email);
                setName(userData.name);
                setData(userData.dateOfBirth || ''); // Adicionei uma data padrão vazia se não existir
                setPhone(userData.phone || ''); // Adicionei telefone vazio se não existir
            }
        }
    };

    // Chama a função fetchUserData ao carregar a tela
    useEffect(() => {
        fetchUserData();
    }, []);

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

    // Função para salvar as alterações
    const handleSaveChanges = async () => {
        const userId = auth.currentUser?.uid; // Obtém o ID do usuário logado
        if (userId) {
            try {
                await setDoc(doc(db, 'users', userId), {
                    name: name,
                    email: email,
                    dateOfBirth: data,
                    phone: phone,
                }, { merge: true }); // Usando merge para não sobrescrever os dados anteriores

                Alert.alert('Sucesso', 'Dados atualizados com sucesso!', [
                    {
                        text: 'OK',
                        onPress: () => router.push('/dashboard/perfil'),
                    },
                ]);
            } catch (error) {
                console.error('Erro ao atualizar os dados: ', error);
                Alert.alert('Erro', 'Ocorreu um erro ao salvar as alterações.');
            }
        }
    };

    const handleGoBack = () => {
        router.push('/dashboard/perfil')
    };

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }


    return (
        <ScrollView style={styles.container}>
            <View>
                <StatusBar barStyle="light-content" backgroundColor="#1c2120" />

                {/* Dark Section - Header and Profile */}
                <View style={styles.darkSection}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.returnButton} onPress={handleGoBack}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.returnText}>Informações pessoais</Text>
                    </View>
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        {/* Profile Image */}
                        <Image
                            source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }} // Placeholder image
                            style={styles.profileImage}
                            alt="Avatar of Sofia Defani"
                        />
                        <Text style={styles.profileName}>{userName}</Text>
                    </View>
                </View>

                {/* Light Section - Form */}
                <View style={styles.lightSection}>
                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>E-MAIL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o seu e-mail"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={value => setEmail(value)}
                        />
                        <Text style={styles.label}>NOME COMPLETO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o seu nome completo"
                            value={name}
                            onChangeText={value => setName(value)}
                        />
                        <Text style={styles.label}>DATA DE NASCIMENTO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            keyboardType="numeric"
                            value={data}
                            onChangeText={handleDateChange}
                            maxLength={10}
                        />
                        <Text style={styles.label}>NÚMERO DE CELULAR</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="(XX) XXXXX-XXXX"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={handlePhoneChange}
                            maxLength={15}
                        />
                    </View>
                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                        <Text style={styles.saveButtonText}>Salvar alterações</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.settingsContainer}>
                    <View style={styles.settings}>
                        <TouchableOpacity style={styles.settingItem}>
                            <AntDesign name="mail" size={24} color="black" />
                            <Text style={styles.settingText}>Alterar Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingItem}>
                            <MaterialCommunityIcons name="lock" size={24} color="black" />
                            <Text style={styles.settingText}>Alterar Senha</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Ajuste de espaço para Android
    },
    darkSection: {
        backgroundColor: '#1c2120',
        paddingBottom: 20, // Separação da seção escura para a clara
    },
    lightSection: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
    },
    headerText: {
        color: '#ffffff', // Cor do texto branco
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 16,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 20,
    },
    profileName: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'Roboto_700Bold',
        marginTop: 8,
    },
    formSection: {
        padding: 16,
    },
    label: {
        color: '#8f8e8e',
        marginBottom: 4,
        fontSize: 12,
        fontFamily: 'Roboto_400Regular',
        marginLeft: 10,
    },
    input: {
        backgroundColor: '#e5e5e5', // Fundo cinza claro para os inputs
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: '#4bd5f1',
        padding: 15,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    changePasswordButton: {
        backgroundColor: '#ff4f4f',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16, // Para dar espaço entre os botões
    },
    saveButtonText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Roboto_400Regular'
    },
    formContainer: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    returnButton: {
        padding: 16,
        marginHorizontal: 10,
    },
    returnText: {
        color: '#ffffff',
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        marginTop: 2,
    },
    settingsContainer: {
        paddingHorizontal: 20,
    },
    settings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    settingItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
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
});
