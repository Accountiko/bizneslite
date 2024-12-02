import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation,useLocalSearchParams } from 'expo-router';
import { allPurchaseInvoiceType, useBillStore } from '@/context/bIllingContext';
import * as SQLite from 'expo-sqlite';

const index = () => {
    const navigation = useNavigation();
    const {id} = useLocalSearchParams();
    const [purchaseItem,setPurchaseItem] = useState<allPurchaseInvoiceType>()
    const {all_purchase_invoice} =useBillStore((state)=>(state))

    const getSinglePurchaseInvoice = async()=>{
        const db = await SQLite.openDatabaseAsync("main.db");
        const results  = await db.getAllAsync('SELECT purchaseinvoice.id,items.item_name,items.item_price,purchaseinvoice.qty,purchaseinvoice.total_amount,purchaseinvoice.created_at,purchaseinvoice.total_tax_amount,purchaseinvoice.is_taxable FROM purchaseinvoice JOIN items ON purchaseinvoice.item_id = items.id where purchaseinvoice.id = ?;',id.toString())
        //@ts-ignore
        setPurchaseItem(results[0])

    }
    const handleDeleteinvoice = async()=>{
      Alert.alert('Confirm', 'Do You Want to Delete This Invoice', [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Pressed');
          },
          style: 'cancel', 
        },
        {text: 'Delete', onPress: async() => {
            const db = await SQLite.openDatabaseAsync("main.db");
            await db.runAsync('DELETE FROM purchaseinvoice WHERE id = ?;',parseInt(id.toString()))
            navigation.goBack()
        },style:'destructive'},
      ])
    }

    useEffect(()=>{
        navigation.setOptions({ headerShown: true,headerTitle:`Purchase Invoice #${id}` });
        if(id){
            getSinglePurchaseInvoice()
            //@ts-ignore
            // console.log(all_purchase_invoice.find((i)=>i.id == id))
        } 
    },[])
  return (
    <View style={{padding:20}}>
      <View style={styles.flexitems}>
    <Text style={{fontSize:18,fontWeight:'bold'}}> Purchase invoice #{purchaseItem?.id}</Text>
    <Text>{purchaseItem?.created_at}</Text>
      </View>

      <View style={{backgroundColor:'white',padding:8,borderRadius:5,elevation:3,...styles.flexitems}}>
        <Text>{purchaseItem?.item_name}  x ₹ {purchaseItem?.item_price} x {purchaseItem?.qty} Nos</Text>
        {purchaseItem?.is_taxable ==true? (
          <Text>₹ {purchaseItem?.total_tax_amount}</Text>
        ):(
            <Text>₹ {purchaseItem?.total_amount}</Text>
        )}
       
      </View>
      <View style={styles.flexitems}>
          <Text>Sub Total</Text>
          <Text>₹ {purchaseItem?.total_amount ? purchaseItem?.total_amount : (purchaseItem?.item_price * purchaseItem?.qty)}</Text>
      </View>


      {purchaseItem?.is_taxable == true && (
        <View style={styles.flexitems}>
        <Text>GST amount  </Text>
        <Text>₹ {purchaseItem?.total_tax_amount - purchaseItem?.total_amount}  </Text>
      </View>
      )}
      
      <View style={styles.flexitems}>
      <Text>Paid Amount </Text>
      {purchaseItem?.is_taxable ==true? (
          <Text>₹ {purchaseItem?.total_tax_amount}</Text>
        ):(
            <Text>₹ {purchaseItem?.total_amount}</Text>
        )}
      </View>
      <View style={styles.btn}>
        <Button color={"#eb6359"} title='Delete' onPress={handleDeleteinvoice} />
      </View>
      
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    flexitems :{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        padding:5,
        flexWrap: 'wrap',
    },btn:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        padding:20,
        marginTop:30
    }
})