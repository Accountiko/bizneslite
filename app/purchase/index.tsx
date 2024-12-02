import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBillStore } from '@/context/bIllingContext'
import { useRouter,useFocusEffect, useNavigation } from 'expo-router'
import * as SQLite from 'expo-sqlite';

interface purchaseType {
  id:number
  item_name:string
  qty:number
  total_amount:number
  created_at:string
  total_tax_amount:number
  is_taxable:boolean
}
const index = () => {
  
  const navigation = useNavigation()
    const router = useRouter()
    const [purchase,setPurchase] = useState<purchaseType[]>()
    const {getAllPurchaseInvoices,all_purchase_invoice} = useBillStore((state)=>(state))


    const getpurchase = async ()=>{

        const db = await SQLite.openDatabaseAsync("main.db");
        const results :purchaseType[] = await db.getAllAsync('SELECT purchaseinvoice.id,items.item_name,purchaseinvoice.qty,purchaseinvoice.total_amount,purchaseinvoice.created_at,purchaseinvoice.total_tax_amount,purchaseinvoice.is_taxable FROM purchaseinvoice JOIN items ON purchaseinvoice.item_id = items.id ORDER BY purchaseinvoice.id DESC ;')
       console.log(results);
        setPurchase(results)
    }
    useFocusEffect(
      React.useCallback(() => {
        getpurchase()
        // Do something when the screen is focused
        return () => {
          // Do something when the screen is unfocused
          // Useful for cleanup functions
        };
      }, []))
    useEffect(()=>{
      navigation.setOptions({ headerShown: true,headerTitle:'All Purchase Invoice' });
        getpurchase()
    },[])
  return (
    <View>
      <Button title='Add Purchase Invoice' onPress={()=>{router.push('/purchase/addpurchase')}}  />
        <ScrollView contentContainerStyle={{
          display:'flex',
          flexDirection:'column', 
          justifyContent:'center',
        }}>
          {purchase?.map((i)=>(
              <TouchableOpacity onPress={()=>{router.push({pathname:'/purchase/details',params:{id:i.id}})}} key={i.id} style={styles.invoicecontainer}>
              <View style={styles.content}>
                <Text style={{fontWeight:'bold',fontSize:16}}>Purchase Invoice #{i.id}</Text>
                <Text>{i.qty} Nos</Text>
              </View>
              <View style={styles.content}>
                
                <View style={{gap:5,...styles.content}}>
                <Text style={{fontWeight:'bold'}}>{i.item_name}</Text>
                <Text style={{fontSize:12,fontWeight:'light'}}>{i.created_at}</Text>
                </View>  
                {i.is_taxable  ?(
                  <Text>₹ {i.total_tax_amount}</Text>      
                ):(
                  <Text>₹ {i.total_amount}</Text>       
                )}
                 
              </View>
  
            </TouchableOpacity>
          ))}
        

        </ScrollView>
      
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  invoicecontainer: {
    display:'flex',
    flexDirection: 'column',
    width:'95%',
    padding:10,
    margin:5,
    backgroundColor:'#FFFFFF',
    borderRadius:5,
    elevation:3,

  },
  content :{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center'
  }
})