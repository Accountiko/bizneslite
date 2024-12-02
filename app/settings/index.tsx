import { Button, StyleSheet, Text, TextInput, View ,Alert,ToastAndroid, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import * as SQLite from 'expo-sqlite';
import Checkbox from 'expo-checkbox';
import { allSaleinvoiceType } from '@/context/bIllingContext';


export interface settingTypes  {
    id :number,
    company_name:string,
    company_address:string,
    gstin:string
    is_gst_bill:number

}
const index = () => {
    const navigation = useNavigation()
    const router = useRouter()
    const [settings,setSettings] = useState<settingTypes|null>()
    const [isGST,setIsGST] = useState<boolean>(false)
    
   

    const getSettings = async() => {
        const db = await SQLite.openDatabaseAsync("main.db");
        const settings :settingTypes = await db.getFirstAsync('select * from settings; ')
        setSettings(settings)
        setIsGST(settings?.is_gst_bill==1?true:false)
       
        console.log(settings,'from settings')
    }
  
    useEffect(()=>{
        navigation.setOptions({ headerShown: true,headerTitle:'Settings' });
        getSettings()
       

    },[])
    const handleloadGST = async () => {
        Alert.alert('Confirm', 'Do You Want to Load GST %', [
            {
              text: 'Cancel',
              onPress: () => {
                console.log('Cancel Pressed');
              },
              style: 'cancel', 
            },
            {text: 'OK', onPress: async() => {
                const db = await SQLite.openDatabaseAsync("main.db");
                await db.execAsync(`
                    INSERT into Item_tax(tax_percentage) VALUES (5);
                    INSERT into Item_tax(tax_percentage) VALUES (12);
                    INSERT into Item_tax(tax_percentage) VALUES (18);
                    INSERT into Item_tax(tax_percentage) VALUES (28);
                    `)
                    ToastAndroid.showWithGravity(
                        'Load GST % Successfully',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                      );
            }},
          ]);
    }

    const handlechnageisgst = async (value: boolean) => {
        const db = await SQLite.openDatabaseAsync("main.db");
        if(settings?.id){
            await db.runAsync(`UPDATE settings SET is_gst_bill = ? WHERE id = 1;`, value,settings?.id);
            setIsGST(value)
            ToastAndroid.showWithGravity(
               value==true ? 'Enable GST BILLING' : 'Disable GST BILLING',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
        }else{
          console.log('from new')
            const results =  await db.runAsync(`INSERT INTO settings (is_gst_bill) VALUES (?);`, value);
            if(results.lastInsertRowId ){
                ToastAndroid.showWithGravity(
                    value==true ? 'Enable GST BILLING' : 'Disable GST BILLING',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
            }
        }
       
    }
   

  
  return (
    <View style={{padding:20}}>

        <TouchableOpacity onPress={()=>router.push('/settings/company')} style={styles.row}>
            <Text style={styles.label}>Company Profile  </Text>
        </TouchableOpacity>

        <View style={{flexDirection:"row",alignItems:"center",margin:0,gap:10,marginVertical:10,...styles.row}}>
            <Checkbox value={isGST} onValueChange={(value:boolean)=>handlechnageisgst(value)}/>
            <Text>Enable GST bill</Text>
        </View>

        
        <View style={{marginVertical:15,flexDirection:'row',justifyContent:'center'}}>
            <View style={{width:'40%'}}>
                <Button onPress={()=>handleloadGST()} title='Load GST %'/>
            </View>
        </View>
        {/* <Button onPress={()=>exportToExcel(saleinvoice, 'saleinvoice report')} title='export Sale ' /> */}
      
    </View>
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
      },
      row:{
        padding:10,
        paddingBottom:10,
        borderBottomColor: '#C0C0C0',
        borderBottomWidth: 1,
        backgroundColor: '#FFFFFF',
        borderRadius:4,
      }
})