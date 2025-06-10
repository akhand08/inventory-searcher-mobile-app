import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Register the tabs layout folder */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Other screens */}
      <Stack.Screen name="view-selected" options={{ title: 'View Selected' }} />
    </Stack>
  );
}
