import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Map from '../components/Map'

export default function Index() {
  return (
    <Map/>
  );
}

const styles=StyleSheet.create(
    {
        container:{
            flex:1,
        },
        map:{
            flex:1
        }
    }
)
