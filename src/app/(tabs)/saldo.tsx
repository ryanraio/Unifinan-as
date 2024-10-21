import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Platform, ScrollView, TextInput, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { db, auth } from '../../../config/firebase'; // Seu arquivo de config do Firebase
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker'; // Importando o Picker

export default function SaldoScreen() {
    const navigation = useNavigation();
    const router = useRouter();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [saldo, setSaldo] = useState(0);  // Estado para o saldo atual
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');
    const [transacoes, setTransacoes] = useState([]);

    const [categoria, setCategoria] = useState('Entradas');
    const [subCategoria, setSubCategoria] = useState('');
    const [detalhe, setDetalhe] = useState('');

    const subCategorias = {
        Entradas: ['Salários', 'Rendimentos', 'Vendas', 'Presentes', 'Outras'],
        Despesas: ['Moradia', 'Serviços', 'Transportes', 'Educação', 'Saúde', 'Empréstimos', 'Assinaturas', 'Impostos', 'Alimentação', 'Vestuário', 'Lazer', 'Beleza', 'Pets', 'Casa', 'Doações', 'Outros'],
    };

    const detalhes = {
        //Despesas
        Moradia: ['Aluguel', 'Condomínio', 'IPTU', 'Seguro', 'Reformas'],
        Serviços: ['Internet', 'Eletricidade', 'Água', 'Telefones', 'Gás'],
        Transportes: ['Combustível', 'Transporte Público', 'Manutenção', 'Aplicativos de Transporte.'],
        Educação: ['Escolas', 'Cursos', 'Material escolar', 'Mensalidades'],
        Saúde: ['Planos de saúde', 'Medicamentos', 'Consultas', 'Tratamentos'],
        Empréstimos: ['Parcelas de empréstimos', 'Financiamentos', 'Cartão de crédito'],
        Assinaturas: ['Netflix', 'Spotify', 'Revistas', 'Jornais', 'Apps'],
        Impostos: ['IRPF', 'INSS', 'Outros impostos'],
        Alimentação: ['Mercado', 'Restaurantes', 'Lanches', 'Bebidas'],
        Vestuário: ['Roupas', 'Calçados', 'Acessórios'],
        Lazer: ['Viagens', 'Cinema', 'Shows', 'Hobbies', 'Presentes'],
        Beleza: ['Salão de beleza', 'Produtos de higiene pessoal'],
        Pets: ['Ração', 'Veterinário', 'Produtos para pets'],
        Casa: ['Móveis', 'Decoração', 'Utensílios domésticos'],
        Doações: ['Organizações não governamentais'],
        Outros: ['Despesas não categorizadas'],
        //Entradas
        Salários: ['Salário Fixo', 'Bônus', 'Horas Extras'],
        Rendimentos: ['Aluguel', 'Dividendos', 'Juros'],
        Vendas: ['Venda de Bens', 'Serviços', 'Artesanato'],
        Presentes: ['Dinheiro', 'Presentes em Espécie'],
        Outras: ['Entradas não Categorizadas'],

    };



    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%', '80%'], []);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const saldoRef = doc(db, 'users', user.uid);
            const unsubscribeSaldo = onSnapshot(saldoRef, (saldoSnap) => {
                if (saldoSnap.exists()) {
                    setSaldo(saldoSnap.data().balance);
                } else {
                    console.log("Documento de saldo não encontrado!");
                }
            });
    
            // Escutar mudanças na coleção "Saldo" em tempo real
            const transacoesRef = collection(db, 'users', user.uid, 'Saldo');
            const unsubscribeTransacoes = onSnapshot(transacoesRef, (transacoesSnap) => {
                const transacoesData = transacoesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTransacoes(transacoesData);
                console.log("Transações atualizadas: ", transacoesData);
            });
    
            // Limpar o listener ao desmontar o componente
            return () => {
                unsubscribeSaldo();
                unsubscribeTransacoes();
            };
        }
    }, []);

    const handleOpenSheet = () => {
        setIsSheetOpen(true);
        bottomSheetRef.current?.expand();
    };

    const handleGoBack = () => {
        router.push('/dashboard');
    };

    const handleSave = async () => {
        const user = auth.currentUser;

        if (user) {
            try {
                const valorNum = parseFloat(valor); // Converte o valor para número

                // Atualiza o saldo baseado na categoria
                const newSaldo = categoria === 'Entradas'
                    ? saldo + valorNum  // Adiciona se for entrada
                    : saldo - valorNum; // Subtrai se for despesas

                await updateDoc(doc(db, 'users', user.uid), {
                    balance: newSaldo,
                });

                // Salva a transação na subcoleção "Saldo"
                const saldoRef = collection(db, 'users', user.uid, 'Saldo');
                await addDoc(saldoRef, {
                    valor: valorNum,
                    categoria,
                    subCategoria,
                    detalhe,
                    data,
                });

                // Atualiza o saldo no estado local
                setSaldo(newSaldo);

                console.log('Saldo e transação registrados com sucesso.');
                setIsSheetOpen(false); // Fecha o bottom sheet
                // Limpa os campos após salvar
                setValor('');
                setCategoria('Entradas'); // Reseta a categoria para o valor padrão
                setSubCategoria('');
                setDetalhe('');
                setData('');
            } catch (err) {
                console.log('Erro ao atualizar saldo e registrar transação: ', err.message);
            }
        }
    };

    const handleDateChange = (text) => {
        const cleaned = ('' + text).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);

        if (match) {
            const formattedDate = [match[1], match[2], match[3]].filter(Boolean).join('/');
            setData(formattedDate);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1c2120" />

                {/* Conteúdo scrollável */}
                <ScrollView style={{ backgroundColor: '#fff' }}>
                    <View style={styles.userInfoContainer}>
                        <TouchableOpacity style={styles.returnButton} onPress={handleGoBack}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="white" />
                        </TouchableOpacity>
                        <View style={styles.userText}>
                            <Text style={styles.greetingText}>Seu saldo</Text>
                            <Text style={styles.subText}>Você pode consultar o seu aqui</Text>
                        </View>
                        <Image
                            source={{ uri: 'https://placehold.co/50x50' }}
                            style={styles.userImage}
                        />
                    </View>

                    <View style={styles.container1}>
                        <LinearGradient
                            colors={['#5d3fd3', '#d9f0ff']}
                            style={[styles.cardContainer, { transform: [{ rotate: '-3deg' }] }]}
                        >
                            <View style={[styles.overlay, { transform: [{ rotate: '3deg' }] }]} />
                            <Text style={[styles.cardText, { transform: [{ rotate: '3deg' }] }]}>Saldo atual</Text>
                            <View style={[styles.balanceContainer, { transform: [{ rotate: '3deg' }] }]}>
                                <View style={styles.hiddenBalance}>
                                    <Text style={styles.hiddenText}>R$ {saldo}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.learnMoreButton, { transform: [{ rotate: '3deg' }] }]}
                                onPress={handleOpenSheet}
                            >
                                <Text style={styles.learnMoreText}>Editar Valor</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        {/* Lista de transações */}
                        <View style={styles.transacoesContainer}>
                            <Text style={styles.transacoesTitle}>Últimas transações pessoais</Text>
                            {transacoes.map((transacao) => (
                                <View key={transacao.id} style={styles.transacaoItem}>
                                    <Text>Categoria: {transacao.categoria}</Text>
                                    <Text>Subcategoria: {transacao.subCategoria}</Text>
                                    <Text>Detalhe: {transacao.detalhe}</Text>
                                    <Text>Valor: R$ {transacao.valor.toFixed(2)}</Text>
                                    <Text>Data: {transacao.data}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Sheet fora do ScrollView */}
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1} // Começa fechado
                    snapPoints={snapPoints}
                    onClose={() => setIsSheetOpen(false)}
                    enablePanDownToClose={true}
                    backgroundStyle={{
                        backgroundColor: '#ffffff', // Cor de fundo do BottomSheet
                        borderTopLeftRadius: 20,    // Cantos arredondados para o topo
                        borderTopRightRadius: 20,
                        borderWidth: 2,             // Largura da borda
                        borderColor: '#6246ea',     // Cor da borda
                    }}
                    handleIndicatorStyle={{ backgroundColor: '#6246ea' }} // Cor do handle
                >
                    <KeyboardAvoidingView behavior="padding" style={styles.sheetContent}>
                        <Text style={styles.sheetTitle}>Editar informações</Text>


                        <Text style={styles.header}>CATEGORIA</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={categoria}
                                onValueChange={(itemValue) => {
                                    setCategoria(itemValue);
                                    setSubCategoria(''); // Resetar subcategoria ao mudar a categoria
                                    setDetalhe(''); // Resetar detalhe ao mudar a categoria
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="Entradas" value="Entradas" />
                                <Picker.Item label="Despesas" value="Despesas" />
                            </Picker>
                        </View>

                        <Text style={styles.header}>SUBCATEGORIA</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={subCategoria}
                                onValueChange={(itemValue) => {
                                    setSubCategoria(itemValue);
                                    setDetalhe(''); // Resetar detalhe ao mudar a subcategoria
                                }}
                                style={styles.picker}
                            >
                                {/* Mapeia as subcategorias com base na categoria selecionada */}
                                {subCategorias[categoria]?.map((subCat) => (
                                    <Picker.Item key={subCat} label={subCat} value={subCat} />
                                ))}
                            </Picker>
                        </View>

                        <Text style={styles.header}>DETALHES</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={detalhe}
                                onValueChange={(itemValue) => setDetalhe(itemValue)}
                                style={styles.picker}
                            >
                                {/* Mapeia os detalhes com base na subcategoria selecionada */}
                                {subCategoria && detalhes[subCategoria]?.length > 0 ? (
                                    detalhes[subCategoria].map((det) => (
                                        <Picker.Item key={det} label={det} value={det} />
                                    ))
                                ) : (
                                    <Picker.Item label="Sem detalhes disponíveis" value="" />
                                )}
                            </Picker>
                        </View>

                        <Text style={styles.header}>VALOR</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digitar valor"
                            keyboardType="numeric"
                            value={valor}
                            onChangeText={setValor}
                        />
                        <Text style={styles.header}>DATA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            keyboardType="numeric"
                            value={data}
                            onChangeText={handleDateChange}
                            maxLength={10}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Salvar</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container1: {
        backgroundColor: '#fff',
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
    },
    userText: {
        flexDirection: 'column',
    },
    greetingText: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'Poppins_700Bold',
    },
    subText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Poppins_400Regular',
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    cardContainer: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 54,
        borderColor: '#04172e',
        marginTop: -64,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 12,
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
        fontFamily: 'Poppins_700Bold',
    },
    learnMoreButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
        marginTop: 12,
    },
    learnMoreText: {
        color: '#6246ea',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    sheetContent: {
        padding: 20,
        backgroundColor: '#fff'
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
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
    inputPicker: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        marginBottom: 15,
        justifyContent: 'center', // Centraliza verticalmente
    },
    picker: {
        height: '100%', // Ajusta a altura do Picker
        width: '100%',
        marginHorizontal: -6,
    },
    saveButton: {
        backgroundColor: '#00cfff',
        padding: 10,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    saveButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    returnButton: {
        padding: 16,
        marginRight: -50,
        marginLeft: 2,
        marginTop: -30,
    },
    transacoesContainer: {
        marginTop: 20,
        padding: 16,
    },
    transacoesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    transacaoItem: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
});
