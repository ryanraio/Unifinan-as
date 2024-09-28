import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#121212",
                },
                headerTintColor: "#fff",
            }}
            initialRouteName="login"
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="apresentation1" options={{ headerShown: false }} />
            <Stack.Screen name="apresentation2" options={{ headerShown: false }} />
            <Stack.Screen name="apresentation3" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="digital" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}
