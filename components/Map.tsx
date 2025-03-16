import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MarkerData } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDatabase } from '../contexts/DatabaseContext';

const Map = () => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const router = useRouter();
    const { getMarkers, addMarker, isLoading } = useDatabase();
    const params = useLocalSearchParams<{ refresh: string }>();
    const loadMarkers = async () => {
        try {
            const loadedMarkers = await getMarkers();
            setMarkers(loadedMarkers);
        } catch (error) {
            console.error('ошибка:', error);
        }
    };
    
    useEffect(() => {
        if(isLoading===false)
            loadMarkers()
    }, [isLoading]);

    useEffect(() => {
        if (params.refresh === 'true') {
          loadMarkers();
        }
      }, [params.refresh, loadMarkers]);
      
    const newMarker = async (event: any) => {
        const coordinate = event.nativeEvent.coordinate;
        const newid = await addMarker(coordinate.latitude, coordinate.longitude);
        const newMark: MarkerData = {
            id: newid.toString(),
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            date: Date.now().toString(),
        }
        setMarkers((prev) => [...prev, newMark]);
    }

    const markerPress = (marker: MarkerData) => {
        router.push(`/marker/${marker.id}`)
    }
    return (
        // console.log('маркеры: ', (markers)),
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
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                        onPress={() => markerPress(marker)}
                    />
                ))}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        },
        map: {
            flex: 1
        }
    }
)

export default Map;