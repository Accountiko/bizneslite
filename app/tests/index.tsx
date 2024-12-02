import { Button, StyleSheet, Text, View,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { Suspense } from 'react';
import * as ImagePicker from 'expo-image-picker';



const index = () => {
  const [image, setImage] = useState(null);

    const connectdb = async()=>{
      const db = await SQLite.openDatabaseAsync("main.db");
      const images   = await db.getAllAsync('SELECT * FROM images');
      setImage(images)
  
    }
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true
      });
  
      console.log(result);
  
      if (!result.canceled) {
        
        const db = await SQLite.openDatabaseAsync("main.db");
        const results = await db.runAsync("INSERT into images(name,base64) VALUES (?,?);",result.assets[0].fileName,result.assets[0].base64 );
        console.log(results.lastInsertRowId)
        connectdb()
      }
    };



    useEffect(()=>{
        connectdb()
        
    },[])
  return (
    <View>
    <Button title="Pick an image from camera roll" onPress={pickImage} />
    {image?.map((i:any)=>(
      <Image key={i.id} source={{ uri: `data:image/png;base64,${i.base64}`   }} style={styles.image} />
    ))}
    {/* {image && <Image source={{ uri:  }} style={styles.image} />} */}
       
    </View>
  )
}

export default index

const styles = StyleSheet.create({
image: {
  width: 200,
  height: 200,
  }
})