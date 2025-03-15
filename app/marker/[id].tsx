import { Text, View, StyleSheet, FlatList, Image, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ImageData } from "@/types";
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from "react";
import { useDatabase } from "@/contexts/DatabaseContext";
export default function MarkerDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [localImages, setLocalImages] = useState<ImageData[]>([])
  const { getMarkerImages, addImage, deleteImage, deleteMarker } = useDatabase();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getMarkerImages(Number(id));
        setLocalImages(images);
      }
      catch (error) {
        Alert.alert('Не удалось загрузить изображения')
      }
    };
    loadImages();
  }, [id]
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {

      await addImage(Number(id), result.assets[0].uri)
      setLocalImages(await getMarkerImages(Number(id)))
    }
    else {
      alert('Фото не выбрано');
    }
  };

  const handledeleteImage = async (image_id: number,id:number) => {
    try{
      await deleteImage(image_id);
      const newImages = localImages.filter((_, i) => i !== id);
      setLocalImages(newImages);
    }
    catch(error) {
      Alert.alert('error','Не удалось удалить фото')
    }
  };
  
  const handleDeleteMarker = async ()=>{
    try{
      await deleteMarker(Number(id));

      router.back();
      router.setParams({ refresh: 'true' });
    }
    catch(error){
      Alert.alert('error', 'Не удалось удалить маркер')
    }
  };

  return (
    console.log(id),
    console.log(localImages),

    <View style={styles.container}>
      
      <Button title="Delete marker" onPress={handleDeleteMarker} />
      <Button title="Add Image" onPress={pickImage} />
      
      <FlatList
        data={localImages}
        renderItem={({ item,index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: (item.uri) }} style={styles.image} />
            <Button title="Delete" onPress={() => handledeleteImage(Number(item.id),index)} />
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