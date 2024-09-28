import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'

export default function Layout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#8508b2', // Cor ativa
            tabBarInactiveTintColor: 'gray', // Cor inativa
        }}>
            <Tabs.Screen
                name='index'
                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({ focused, color, size }) => {

                        if (focused) {
                            return <FontAwesome name='home' color={color} size={size} />
                        }

                        return <FontAwesome name='home' color={color} size={size} />
                    }
                }}

            />
            <Tabs.Screen
                name='perfil'
                options={{
                    headerShown: false,
                    title: "Perfil",
                    tabBarIcon: ({ focused, color, size }) => {

                        if (focused) {
                            return <FontAwesome name='user' color={color} size={size} />
                        }

                        return <FontAwesome name='user' color={color} size={size} />
                    }
                }}

            />
        </Tabs>
    )
}