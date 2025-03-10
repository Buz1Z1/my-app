import { Stack } from "expo-router";
import Map from "@/components/Map";
import MarkerDetail from "./marker/[id]";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="Map" options={{title: 'Map'}}/>
    <Stack.Screen name="MarkerDetail" options={{title: 'Marker'}}/>
  </Stack>
  )
}

