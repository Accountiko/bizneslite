import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View ,ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBillStore } from '@/context/bIllingContext'
import { useNavigation, useRouter,useFocusEffect } from 'expo-router'


const index = () => {
  const navigation = useNavigation()
  const router = useRouter()
  const [loading,setLoading] = useState(false)
  

    const {getAllSaleInvoice,all_sale_invocie} = useBillStore((state)=>(state))

    useFocusEffect(
      React.useCallback(() => {
        getAllSaleInvoice()
        // Do something when the screen is focused
        return () => {
          // Do something when the screen is unfocused
          // Useful for cleanup functions
        };
      }, []))

    useEffect(() => {
      navigation.setOptions({ headerShown: true,headerTitle:'All sale Invoice' });
        getAllSaleInvoice()
    },[])
    // console.log(all_sale_invocie)
    const dateTimeFormator = (date:Date) => {
        // console.log(date?.getDate())
        const Newdate = new Date(date);
        return Newdate.toLocaleString()
    }

    const handlepages = ()=>{
      if(all_sale_invocie.length !=0){
        setLoading(true);
        setTimeout(() => {
          getAllSaleInvoice(Math.round(all_sale_invocie.length/12)+1)
          setLoading(false);
        },800);
      }
     
    }
    const renderFooter = () => {
      if (!loading) return null;
      return <ActivityIndicator size="large" color="#FD673A" />;
    };
   
    // console.log( new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  return (
    <View>
     
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
    

        <FlatList data={all_sale_invocie}
       
       renderItem={({item})=>(
         <TouchableOpacity onPress={()=>router.push({pathname:'/invoices/details',params:{id :item.id}})} key={item.id} style={styles.invoicecontainer}>
         <View style={styles.content}>
           <Text style={{ fontWeight: "bold", fontSize: 16 }}>
             Sale Invoice #{item.id}
           </Text>
           <Text>{item.qty} Nos</Text>
         </View>
         <View style={styles.content}>
           <View style={{ gap: 5, ...styles.content }}>
             {item.is_taxable ? <Text>GST BILL</Text> : null}
      
             <Text style={{ fontSize: 12, fontWeight: "light" }}>
               {item.created_at}
             </Text>
           </View>
           {item.is_taxable ? (
             <Text>₹ {item.total_tax_amount.toFixed(2)}</Text>
           ) : (
             <Text>₹ {item.total_amount}</Text>
           )}
         </View>
       </TouchableOpacity>
       )}
       keyExtractor={(item) => item.id.toString()}
       onEndReached={handlepages}
       ListFooterComponent={renderFooter}
       onEndReachedThreshold={0.9}
       />
       
         

       
        
    
      </View>
    </View>
  );
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