import { Button, StyleSheet, Text, TouchableOpacity, View,BackHandler, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useNavigation,useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioGroup from 'react-native-radio-buttons-group';
import Icon from 'react-native-vector-icons/FontAwesome';
import { itemsType, useBillStore } from "@/context/bIllingContext";
import * as ScreenOrientation from 'expo-screen-orientation';
import Checkbox from "expo-checkbox";
import Category from "@/components/Category";
import Item from "@/components/Item";

const cat = [
  { id: 1, name: "All" },
  { id: 2, name: "Drinks" },
  { id: 3, name: "Main" },
  { id: 4, name: "Sides" },
];




 const paymentmode = [
    {
        id: 'cash', // acts as primary key, should be unique and non-empty string
        label: 'Cash',
        value: 'cash'
    },
    {
        id: 'upi',
        label: 'UPI',
        value: 'upi'
    }
]
const index = () => {
  const [isTaxable,setIsTaxable] = useState()
  const [activteCat,setActiveCat] = useState<number|null>(null)
  
  const navigation = useNavigation();
  //@ts-ignore
  const {items,orderitems,sale_invocie,addOrderItem,qtyIncr,qtyDecr,removeItem,setPaymentMode,Checkout,getItemsFromDb,getSaleInvocie,deleteSaleInvocie,itemTax,getItemTaxFromDB,setTaxableToInvoice} = useBillStore((state)=>(state))
  const [productItem,setProductItem] = useState<itemsType[]>(items)
  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }
  const backAction = async() => {
    console.log("back")
    deleteSaleInvocie();
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    navigation.goBack();
    return true
  }
  useFocusEffect(
    React.useCallback(() => {
      getItemsFromDb();
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []))
useEffect(()=>{
    changeScreenOrientation();
    getSaleInvocie();
    getItemTaxFromDB();
    getItemsFromDb();
    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      //@ts-ignore
      backAction,
    );


    return () => backHandler.remove();
},[])
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    
  }, [navigation]);

 

  useEffect(()=>{

    if(activteCat ==null){
      setProductItem(items)
    }else{
      setProductItem(items.filter((i)=>i.category_id == activteCat))
      console.log(items.filter((i)=>i.category_id == activteCat))
    }
    
  },[activteCat])

  const handleAddItemToCart = (item:itemsType) => {
    console.log(sale_invocie.is_taxable,'from add')
    var temp = orderitems.find((i)=>i.id == item.id)
    if(temp){
      if(sale_invocie.is_taxable){
        qtyIncr(temp.id,temp.item_tax_id)
      }else{
        qtyIncr(temp.id)
      }
     
    }else{
      if(sale_invocie.is_taxable){
        var tax = itemTax.find((i)=>i.id == item.item_tax_id)
        if(item.is_taxable){
          addOrderItem(
            { "id":item.id, "name": item.item_name, "price": item.item_price, "qty": 1, "amount": item.item_price ,"item_tax_id":item.item_tax_id,'tax_amount':(item.item_price +(item.item_price*(tax.tax_percentage/100)))}
          )
        }else{
          addOrderItem(
            { "id":item.id, "name": item.item_name, "price": item.item_price, "qty": 1, "amount": item.item_price ,"item_tax_id":null}
          )
        }
       
      }else{
        addOrderItem(
          { "id":item.id, "name": item.item_name, "price": item.item_price, "qty": 1, "amount": item.item_price }
        )
      }
     
    }
 
  
    
  }

  const handleDecrement = (item:any) => {
    var temp = orderitems.find((i)=>i.name == item.name)
    if(temp.qty===1){
      removeItem(temp.id,item.item_tax_id)
    }else{
      qtyDecr(temp.id,temp.item_tax_id)
    }
  }

  return (
    <SafeAreaView style={styles.continer}>
     
      <View style={{ display: "flex", flexDirection: "row" ,justifyContent:"space-between",alignItems:"center"}}>
        <View style={{ width: "50%" }}>
          <View><Category activteCat={activteCat} setActivteCat={setActiveCat}/></View>
          
          <ScrollView persistentScrollbar={true} style={styles.itemContainer} contentContainerStyle={{flexDirection:'row',flexWrap:'wrap',width:'100%',gap:15,paddingVertical:12}}>
            {(activteCat!=null?productItem:items).map((item) => (
              <Item  key={item.id} item={item} itemPress = {()=>handleAddItemToCart(item)} />
            
            ))}
          </ScrollView>
        </View>
        <View  style={{width: "47%",  height: "100%" ,padding:5}}>
        <Text style={{fontWeight:'bold',fontSize:18,marginTop:-7}}>Invocie  # {sale_invocie.invoiceId}</Text>
          {/* <View  style={{flexDirection:"row",alignItems:"center",margin:0,gap:10,marginBottom:5}}>
            <Checkbox value={sale_invocie.is_taxable} onValueChange={(value:any)=>setTaxableToInvoice(value)} />
            <Text>is GST bill</Text>
          </View> */}
          
          <View style={styles.orderitemHeading}>
            <Text style={styles.orderitemHeadingText}>Item Name</Text>
            <Text style={{...styles.orderitemHeadingText,paddingLeft:5}}>Price</Text>
            <Text style={styles.orderitemHeadingText}>Qty</Text>
            <Text style={styles.orderitemHeadingText}>Amount </Text>
            
          </View>
          <ScrollView persistentScrollbar={true} style={{height:'25%'}}>
            {orderitems.map((item) => (
                   <View key={item.id} style={styles.orderitem}>
                   <Text style={{flex:1,width:100,flexWrap:'wrap'}}>{item.name}</Text>
                   <Text style={{flex:1}}>₹ {item.price}</Text>
                   <View
                     style={{
                       display: "flex",
                       flexDirection: "row",
                       gap: 5,
                       alignItems: "center",
                       flex:1,
                       marginLeft:-40
                     }}
                   >
                     <TouchableOpacity
                       style={{borderColor:'red',...styles.actionBtn}}
                       onPress={()=>handleDecrement(item)}
                     >
                      <Text> - </Text>
                       
                     </TouchableOpacity>
                   <Text style={{marginHorizontal:6}}>{item.qty}</Text> 
                     <TouchableOpacity
                       style={{borderColor:'green',...styles.actionBtn}}
                       onPress={()=>qtyIncr(item.id,item.item_tax_id)}
                     >
                       <Text> + </Text>
                     </TouchableOpacity>
                   </View>
                   <Text style={{flex:1,marginLeft:20}}>₹  {sale_invocie.is_taxable? item.tax_amount.toFixed(2) :item.amount }  </Text>
                   {/* <TouchableOpacity onPress={()=>removeItem(item.id)} > <Text style={{color:'red',fontWeight:'black'}}> X </Text>  </TouchableOpacity> */}
                 </View>
            ))}
         
           
           
           
         

          </ScrollView>
                  <View>
                      <View style={styles.cartsummary}>
                          <Text>Total Qty</Text>
                          <Text>{sale_invocie.qty}</Text>
                      </View>
                      {sale_invocie.is_taxable ? (
                        <View style={styles.cartsummary}>
                        <Text>Total Tax Amount</Text>
                        <Text>₹ {sale_invocie.total_tax_amount.toFixed(2)}</Text>
                        </View>
                      ):(
                        <View style={styles.cartsummary}>
                        <Text>Total Amount</Text>
                        <Text>₹ {sale_invocie.totalAmount}</Text>
                        </View>
                      )}
                     

                  </View>
                  {/* paymode */}
                  <View style={styles.paymode}>
                      <RadioGroup
                          radioButtons={paymentmode}
                          //@ts-ignore
                          onPress={(mode)=>setPaymentMode(mode)}
                          selectedId={sale_invocie.paymentMode}
                          layout='row'
                      />
                  </View>
                  <View>
                  <Button onPress={Checkout} title="Checkout & print "/>
                  </View>
          
       
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  continer: {
    padding: 20,
   
  },
  catscroll: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 5
  },
  itemlists: {},
  item: {
    display: "flex",
    flexDirection: "row",
    gap: 7,
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    width: 200,
    marginVertical: 7,
  },
  orderitem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },
  orderitemHeading: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderitemHeadingText: {
    fontWeight: "bold",
    flex:1
  },
  cartsummary : {
    display : "flex",
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "space-between",
    marginVertical:5
  },
  paymode:{
    display:'flex',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    marginVertical:7
  },
  itemContainer:{
    backgroundColor:'#dadada',
    height:'84%',
    borderRadius:10,
    paddingHorizontal:12,
    flexWrap:'wrap',
    flexDirection:'row',
    gap:15,
    width:'100%',
},
actionBtn:{
  borderWidth: 1,
 paddingVertical: 1,
paddingHorizontal: 5,
borderRadius: 5
}
});
