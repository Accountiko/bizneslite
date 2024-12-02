import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBillStore } from '@/context/bIllingContext'
import Dropdown from 'react-native-input-select';
import Checkbox from 'expo-checkbox';
import { router ,useNavigation} from 'expo-router';

const index = () => {
    const {items,getItemsFromDb,addPurchaseInvoice,itemTax,getItemTaxFromDB} = useBillStore((state)=>(state))
    const [itemId,setItemId] = useState()
    const [itemPrice,setItemPrice] = useState<number>()
    const [qty,setQty] = useState<number>()
    const [totalAmount,setTotalAmount] = useState<number>()
    const [paidAmount,setPaidAmount] = useState<number>()
    const [isPaid,setIsPaid] = useState<boolean>()
    const [isTaxable,setIsTaxable] = useState<boolean>(false)
    const [taxPercentage,setTaxPercentage] = useState<number>()
    const [total_tax_amount,setTotal_tax_amount] = useState<number>()
    const navigate = useNavigation()

    const itemsOptions = items.map(item => ({
        label: item.item_name,
        value: item.id.toString()
      }));

    const ItemTaxOptions = itemTax.map(item => ({
        label:`${item.tax_percentage}`,
        value: item.tax_percentage
      }));

      useEffect(()=>{
        navigate.setOptions({ headerShown: true,headerTitle:'Add New Purchase Invoice' });
        getItemsFromDb()
        getItemTaxFromDB()
      },[])

    useEffect(()=>{

        if(itemPrice & qty){
          console.log("itemPrice")
            setTotalAmount(itemPrice*qty)
            if(isTaxable){
              setTotal_tax_amount((itemPrice*qty) + (itemPrice*qty)*taxPercentage/100)
            }
        }
       
        
    },[qty,itemPrice])

     
    const handleformvalidation = () => {
        if(!itemId){
            alert("Please Enter Item ")
            return false
        }else if(!itemPrice){
          alert("Please Select Item Price")
          return false
      }else if(!qty){
            alert("Please Enter Item Quantity")
            return false
        }else if(!totalAmount){
            alert("Please Enter Total Amount")
            return false
        }else if(isTaxable && !total_tax_amount){
            alert("Please Enter Total Tax Amount")
            return false
        }
      
        return true
    }
   

    const hanldesave = (type:string) => {
      if(handleformvalidation() == false){
        return
      }
        if(type == "save"){
        
          
            addPurchaseInvoice({item_id:itemId,qty:qty,total_amount:totalAmount,is_paid:isPaid,paid_amount:paidAmount,is_taxable:isTaxable,tax_percentage:taxPercentage,total_tax_amount:total_tax_amount})
            setItemPrice(undefined)
            setQty(undefined)
            setTotalAmount(undefined)
            setPaidAmount(undefined)
            setIsPaid(undefined)
            setItemId(undefined)
            setIsTaxable(false)
            navigate.goBack()
        }else{
          
            addPurchaseInvoice({item_id:itemId,qty:qty,total_amount:totalAmount,is_paid:isPaid,paid_amount:paidAmount,is_taxable:isTaxable,tax_percentage:taxPercentage,total_tax_amount:total_tax_amount})
            setItemPrice(undefined)
            setQty(undefined)
            setTotalAmount(undefined)
            setPaidAmount(undefined)
            setIsPaid(undefined)
            setItemId(undefined)
            setIsTaxable(false)
        }
    }

    const handlecancel = () => {
        setItemPrice(undefined)
        setQty(undefined)
        setTotalAmount(undefined)
        setPaidAmount(undefined)
        setIsPaid(undefined)
        setItemId(undefined)
        navigate.goBack()
    }
    
      

  return (
    <ScrollView contentContainerStyle={{padding:20}} >

      <View style={{marginBottom:10}}>
        <Text style={styles.label}>Select the Item</Text>
        <View>
      <Dropdown
      placeholder="Select Items"
      options={itemsOptions}
      selectedValue={itemId}
      onValueChange={(value:any) => setItemId(value)}
      primaryColor={'green'}
      placeholderStyle={{ color: "#C0C0C0" }}
      dropdownIconStyle={{ top: 8, right: 0 }}
      
    />

      </View>
      </View>
      
     
    <View style={{flexDirection:"row",alignItems:"center",marginBottom:10,paddingVertical:5}}>
    <Checkbox value={isTaxable} onValueChange={setIsTaxable} /> 
    <Text> Is Taxable</Text>
    </View>
    {isTaxable && (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>Select the GST %</Text>
          <View
            style={{
              borderWidth: 2,
              borderColor: "#C0C0C0",
              borderRadius: 4,
              padding: 5,
            }}
          >
            <Dropdown

              placeholder="Select the GST %"
              options={ItemTaxOptions}
              selectedValue={taxPercentage}
              onValueChange={(value: any) => setTaxPercentage(value)}
              primaryColor={'green'}
              placeholderStyle={{ color: "#C0C0C0" }}
              dropdownIconStyle={{ top: 8, right: 0 }}
            />

          </View>
          </View>

    ) }

<View style={{ marginBottom: 10 }}>
        <Text style={styles.label}>Enter the Item Purchase Price (₹) </Text>
        <TextInput
          style={styles.input}
          value={itemPrice?.toString()}
          onChange={(e)=>setItemPrice(Number(e.nativeEvent.text))} 
          inputMode="numeric"
          placeholder="Purchase price of the item "
        />
      </View>

      <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>Enter the Item Quantity </Text>
    <TextInput style={styles.input} inputMode='numeric' value={qty?.toString()} onChange={(e)=>setQty(Number(e.nativeEvent.text))}  placeholder='No Of Quantity' />

      </View>
      <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>Enter the Total Amount (₹)  </Text>
    <TextInput style={styles.input} inputMode='numeric' value={totalAmount?.toString()} onChange={(e)=>setTotalAmount(Number(e.nativeEvent.text))}  placeholder='Total Amount to be paid' />

      </View>
    
  
   
    {isTaxable && <Text style={{marginBottom:10,...styles.label}}>Payable : $ {total_tax_amount}</Text> }
    
    <View style={{flexDirection:"row",alignItems:"center",marginBottom:10,paddingVertical:5}}>
    <Checkbox value={isPaid} onValueChange={setIsPaid} /> 
    <Text> Paid</Text>
    </View>
    <View style={{ marginBottom: 10 }}>
    <Text style={styles.label}>Enter the Paid Amount (₹)  </Text>
    <TextInput style={styles.input} inputMode='numeric' value={paidAmount?.toString()} onChange={(e)=>setPaidAmount(Number(e.nativeEvent.text))}  placeholder='Paid Amount' />

    </View>

    
    
    <Button title='Save' onPress={()=>{
       hanldesave("save")
    }} />
    <Button title='Save and continue' onPress={()=>{
        hanldesave("continue")
    }} />
    <Button title='cancel' color={'red'} onPress={()=>{
       handlecancel()
    }} />
    
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({
  input:{
    borderColor:'#C0C0C0',
    borderWidth: 2,
    borderRadius:4,
    width:'100%',
    paddingHorizontal:5,
    paddingVertical:10,
    marginVertical:5,
    
  },
  label:{
    fontWeight:'bold',
    fontSize:18
  }
})