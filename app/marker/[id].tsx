import { Text, View, StyleSheet, FlatList, Image, Button, Alert, TouchableOpacity } from "react-native";
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
      <TouchableOpacity onLongPress={handleDeleteMarker} style={styles.delete}>
        <Text style={styles.ButtonText}>Удалить маркер</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage} style={styles.add}>
        <Text style={styles.ButtonText}>Добавить фото</Text>
      </TouchableOpacity>
      <FlatList
        data={localImages}
        renderItem={({ item,index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: (item.uri) }} style={styles.image} />
            <TouchableOpacity onPress={() => handledeleteImage(Number(item.id),index)} style={styles.delete}>
              <Text style={styles.ButtonText}>Удалить фото</Text>
            </TouchableOpacity>
            
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
    marginInline: 10,
  },
  delete: {
    backgroundColor: "#940000",
    borderRadius: 10,
    margin: 5,
    padding:10
  },
  deleteim:{
    backgroundColor: "#940000",
    borderRadius: 10,
    margin: 5,
    padding:10
  },
  add:{
    backgroundColor: "#009900",
    borderRadius: 10,
    margin: 5,
    padding:10
  },
  ButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});