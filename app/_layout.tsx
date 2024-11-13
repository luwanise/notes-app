import { Link, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="[note]" options={{headerShown: false}}/>
    </Stack>
  );
}