import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="dashboard" options={{headerShown: false}}/>
            <Stack.Screen name="premium" options={{headerShown: false}}/>
            <Stack.Screen name="editar_dados" options={{headerShown: false}}/>
            <Stack.Screen name="saldo" options={{headerShown: false}}/>
        </Stack>
    )
}