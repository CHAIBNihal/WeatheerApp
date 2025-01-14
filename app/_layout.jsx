import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"   options={{title: "Home", headerShown : false }} />
     
    </Stack>
  );
}
