import React, { useEffect } from 'react'
import { View,Text,StyleSheet } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation';
import { Stack, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Category from '../../components/Category';
import ItemList from '../../components/ItemList';
import Customer from '../../components/Customer';
import * as SQLite from 'expo-sqlite';


function posindex() {
  const navigation = useNavigation();
    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      }

    const DataBaseStartup = async()=> {
      const db = await SQLite.openDatabaseAsync('databaseName');
      
    }
    useEffect(()=>{
        changeScreenOrientation()
    },[])
    
    useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);
  return (
    <SafeAreaView style={styles.conatiner} >
    <View style={styles.itemsection}>
      <View style={styles.catsection}>
        {/* <Category/>  */}
        <ItemList/>
      </View>
       
    </View>
    <View style={styles.cartsection}>
      <Customer/>
       
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  conatiner :{
    flex:1,
    flexDirection:'row',
  },
  itemsection : {
    width:'50%',
    height:'100%',
   
  },
  cartsection : {
    width:'50%',
    height:'100%',
    backgroundColor:'wheat'
  },
  catsection:{
    padding:10
  }
})

export default posindex