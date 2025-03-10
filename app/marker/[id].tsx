import { Text, View, StyleSheet, FlatList, Image, Button, ScrollView } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { MarkerType } from "@/types";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";

export default function MarkerDetail() {
  const router = useRouter();
  const { jmarker } = useLocalSearchParams<{ jmarker: string }>()
  const marker: MarkerType = JSON.parse(jmarker)
  const [localImages, setLocalImages] = useState<string[]>(marker.images)
  // const [marker, setMarker]=useState<MarkerType>()
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const encode=encodeURIComponent(result.assets[0].uri)
      const newImage = [...localImages, encode];
      setLocalImages(newImage)
    }
    else{
      alert('Фото не выбрано');
    }
  };
  const deleteImage = (id: number) => {
    const newImages = localImages.filter((_, i) => i !== id);
    setLocalImages(newImages);
  };
  const Back = () => {
    const updatedMarker = {
      id: marker.id,
      coordinate: marker.coordinate,
      images: localImages,
    };
    
    router.back();
    router.setParams({ updatedMarker: JSON.stringify(updatedMarker) })
  }

  return (
    console.log( localImages),

    <View style={styles.container}>
       <Text>Координаты: {marker.coordinate.latitude}, {marker.coordinate.longitude}</Text>
      <Button title="Сохранить изображения" onPress={Back} />
      <Button title="Add Image" onPress={pickImage} />
      <FlatList
        data={localImages}
        keyExtractor={(index) => index}
        renderItem={({ item,index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: decodeURIComponent(item) }} style={styles.image} />
            <Button title="Delete" onPress={() => deleteImage(index)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
});