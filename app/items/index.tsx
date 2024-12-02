import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View,Pressable,Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBillStore } from '@/context/bIllingContext'
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import ItemListConatiner from '@/components/ItemListConatiner';
import Icon from 'react-native-vector-icons/AntDesign';
import { Searchbar } from 'react-native-paper';


export interface itemsForListType{
  id:number
  item_name :string
  category_name:string
  item_price:number
  image:string
  stock:number
  item_tax_percentage:number

}




const index = () => {
  const navigation = useNavigation();
  const [items,setItems] = useState<itemsForListType[]>([])
  const [searchQuery,setSearchQuery] = useState('')
    const router = useRouter();
    // const {getItemsFromDb,items,deleteItem} =  useBillStore((state)=>(state))

    const getItems = async()=>{
      const db = await SQLite.openDatabaseAsync("main.db");
      const allitems :itemsForListType[] = await db.getAllAsync('SELECT items.id,items.item_name,category.name as category_name,items.item_price,items.stock,Item_tax.tax_percentage as item_tax_percentage,items.image from items LEFT JOIN  category ON items.category_id = category.id  LEFT JOIN Item_tax ON items.item_tax_id = Item_tax.id ORDER BY items.id DESC;');
      // console.log(allitems)
      setItems(allitems)
    }
    const getItemsBysearch = async(query:string)=>{
      const db = await SQLite.openDatabaseAsync("main.db");
      const allitems :itemsForListType[] = await db.getAllAsync('SELECT items.id,items.item_name,category.name as category_name,items.item_price,items.stock,Item_tax.tax_percentage as item_tax_percentage,items.image from items LEFT JOIN  category ON items.category_id = category.id  LEFT JOIN Item_tax ON items.item_tax_id = Item_tax.id  WHERE item_name LIKE ? ORDER BY items.id DESC;',`${query}%`);
      // console.log(allitems)
      setItems(allitems)

    }
    useEffect(()=>{
      if(searchQuery.length > 0){
        getItemsBysearch(searchQuery)
      }else{
        getItems()
      }

    },[searchQuery])
 
    useFocusEffect(
      React.useCallback(() => {
        getItems()
        // Do something when the screen is focused
        return () => {
          // Do something when the screen is unfocused
          // Useful for cleanup functions
        };
      }, []))

    

    useEffect(() => {
      navigation.setOptions({ headerShown: true,headerTitle:'All Items' });
      getItems()
    },[])
  return (
    <View>
      
      <Searchbar
     placeholder='search Items...'
     onChangeText={setSearchQuery}
      value={searchQuery}
      style={{margin:15}}
     />
   
      <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:20}}>
     
     
      <Button title='Add Item' onPress={()=>router.push({pathname:"/items/additem"})}  />
      </View>
      <View  style={{width:"100%",display:'flex',flexDirection:'column',alignItems:'center'}}>
      <FlatList
      data={items}
      renderItem={({item})=>(
        <TouchableOpacity onPress={()=>router.push({pathname:`/items/additem`,params:{id:item.id}})}  key={item.id}>
            <ItemListConatiner  items={item} />
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id.toString()}
      
      />
      
      {/* {items?.map(item => (
        
        
        
      ))} */}
      

      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  
})