import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MarkerType } from '@/types';
// import { useRoute } from '@react-navigation/native';
import { RelativePathString, useNavigation, useRouter } from 'expo-router';
import { routeToScreen } from 'expo-router/build/useScreens';
import { setParams } from 'expo-router/build/global-state/routing';
import { useHrefAttrs } from 'expo-router/build/link/useLinkHooks';
import { useSearchParams } from 'expo-router/build/hooks';



const Map = () => {
    const [markers, setMarker]=useState<MarkerType[]>([]);
    const router=useRouter();
    const sp=useSearchParams();
    
    const newMarker = (event:any) =>{
        const newMarker:MarkerType={
            id: Date.now().toString(),
            coordinate: event.nativeEvent.coordinate,
            images:[]
        }
        setMarker((pred)=>[...pred,newMarker])
    }
    useEffect(() => {
        const updatedMarkerJson = sp.get("updatedMarker"); 
        if (updatedMarkerJson) {
          try {      
            const updatedMarker = JSON.parse(updatedMarkerJson);
            
            setMarker((prevMarkers) =>
              prevMarkers.map((m) =>
                m.id === String(updatedMarker.id)
                  ? { ...m, images: updatedMarker.images }
                  : m
              )
            );
          } catch (error) {
            console.error("Failed to parse updatedMarker:", error);
          }
        } 
      }, [sp.get("updatedMarker")]);
    
    const markerPress=(marker:MarkerType)=>{
        // navigation.navigate('MarkerDetail',marker)
        router.push({
            pathname: `/marker/${marker.id}` as RelativePathString,
            params: {jmarker:JSON.stringify(marker)}
        })
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map}
                initialRegion={{
                    latitude: 58,
                    longitude: 57,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onLongPress={newMarker}
                >
                {markers.map((marker)=> (
                    <Marker
                    key={marker.id}
                    coordinate={marker.coordinate}
                    onPress={()=>markerPress(marker)}
                    />
                ))}
            </MapView>
        </View>
    )
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

export default Map;