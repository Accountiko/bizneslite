import { Button, ScrollView, StyleSheet, Text, View,Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation,useLocalSearchParams } from 'expo-router';
import { allSaleinvoiceType, PrintInvoice, useBillStore } from '@/context/bIllingContext';
import * as SQLite from 'expo-sqlite';

const index = () => {
    const navigation = useNavigation();
    const [saleItem,setSaleItem]  = useState<allSaleinvoiceType>()
    const {id} = useLocalSearchParams();
    const {all_sale_invocie} = useBillStore((state)=>(state))

    const hanledelteinvocie = async()=>{
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
            await db.runAsync('DELETE FROM saleinvoice WHERE id = ?;',parseInt(id.toString()))
            navigation.goBack()
        },style:'destructive'},
      ])
    }

    useEffect(()=>{
        //@ts-ignore
        navigation.setOptions({ headerShown: true,headerTitle:`sale Invoice #${id}` });
        if(all_sale_invocie.length!=0){
            console.log(all_sale_invocie.find((i)=>i.id == parseInt(id.toString())))
            setSaleItem(all_sale_invocie.find((i)=>i.id == parseInt(id.toString())))
        }

    },[])
  return (
    <View style={{padding:20}}>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{fontWeight:'bold',fontSize:20}}>Invocie #{saleItem?.id}</Text>
        <Text>{saleItem?.created_at}</Text>
      </View>
      <ScrollView contentContainerStyle={{borderBlockColor:'#cdcdcd',borderBottomWidth:1,marginBottom:15}}>
        {saleItem?.orderItems?.map((item)=>(
            <View key={`${item.item_name}-${item.id}`} style={styles.orderitemRow} >
        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{fontWeight:'bold'}}>{item.item_name}</Text>
            <View style={{display:'flex',flexDirection:'row',alignItems:'center',gap:5}}>
            <Text style={{fontWeight:'bold',color:'red'}}>₹ </Text>
            {item?.tax_amount != null ? (
                <Text>{item.tax_amount.toFixed(2)}</Text>
            ):(
<Text>{item.amount}</Text>
            )}
            
            </View>
        </View>
        <Text>{item.qty} Nos x ₹ {item.item_price}</Text>

      </View>
        ))}
      

      </ScrollView>


      <View style={styles.flex}>
        <Text>{saleItem?.is_taxable == true?"Sub total":"Total Amount"} </Text>
        <Text>₹ {saleItem?.total_amount}</Text>
      </View>
      {saleItem?.is_taxable == true && ( 
        <View style={styles.flex}>
        <Text>GST amount </Text>
        <Text>₹ {((saleItem?.total_tax_amount)-(saleItem?.total_amount)).toFixed(2)}</Text>
        </View>
      )}
      {saleItem?.is_taxable == true && (
        <View style={styles.flex}>
        <Text>Total amount (with Tax)</Text>
        <Text>₹ {saleItem?.total_tax_amount.toFixed(2)}</Text>
      </View>
      )}

      
     <View style={styles.btn}>
      <Button color={"#eb6359"} title='Delete' onPress={hanledelteinvocie} />
      <Button  title='Print' onPress={()=>PrintInvoice(id)} />
     </View>
     

    </View>
  )
}

export default index

const styles = StyleSheet.create({
    orderitemRow :{
        backgroundColor:'#FFFFFF',
        padding:10,
        margin:5,
        borderRadius:5,
        marginBottom:5,
        elevation:2
    },
    flex:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    btn:{
      display:'flex',
        justifyContent:'center',
        alignItems:'center',
        padding:20,
        marginTop:30,
        gap:30,
        flexDirection:'row'
    }
})