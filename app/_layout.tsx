import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useWalletStore } from "@/app/stores/WalletStore";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

export default function RootLayout() {
  const { connected, loadPersistedConnection } = useWalletStore();

  useEffect(() => {
    loadPersistedConnection();
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!connected ? (
          <Stack.Screen
            name="screens/auth/AuthScreen"
            options={{ gestureEnabled: false }}
          />
        ) : (
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        )}
      </Stack>
    </ThemeProvider>
  );
}
