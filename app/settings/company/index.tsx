import { StyleSheet, Text, View,TextInput,Button,ToastAndroid } from 'react-native'
import React,{useEffect, useState} from 'react'
import { useNavigation } from 'expo-router'
import * as SQLite from 'expo-sqlite';
import { settingTypes } from '..';


const index = () => {
    const navigation = useNavigation()
    const [companyName, setCompanyName] = useState<string>();
    const [companyAddress, setCompanyAddress] = useState<string>();
    const [gstin, setGstin] = useState<string>();
    const [settings,setSettings] = useState<settingTypes|null>()
    const getSettings = async() => {
        const db = await SQLite.openDatabaseAsync("main.db");
        const settings :settingTypes = await db.getFirstAsync('select * from settings; ')
        setSettings(settings)
        if(settings!=null){
            setCompanyName(settings.company_name)
            setCompanyAddress(settings.company_address)
            setGstin(settings.gstin)
        }
        console.log(settings,'from settings')
    }
    useEffect(()=>{
        navigation.setOptions({ headerShown: true,headerTitle:'Company Profile' });
        getSettings()

    },[])
    const handlesubmit = async() => {

        const db = await SQLite.openDatabaseAsync("main.db");
        if(settings?.id){
            const results = await db.runAsync('UPDATE settings SET company_name = ?,company_address = ?,gstin = ? WHERE id = ?;',companyName,companyAddress,gstin,settings.id);
            
                ToastAndroid.showWithGravity(
                    'Company Info Updated',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
            
        }else{
            const results = await db.runAsync('INSERT INTO settings (company_name,company_address,gstin) VALUES (?,?,?);',companyName,companyAddress,gstin)
            if(results.lastInsertRowId ){
                ToastAndroid.showWithGravity(
                    'Company info Saved',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
            }
        }

    }
  return (
    <View style={{padding:20}}>
         <View style={{marginBottom:10}}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput onChange={(e)=>setCompanyName(e.nativeEvent.text)} value={companyName} style={styles.input} placeholder='Enter Company Name' />
        </View>
        <View style={{marginBottom:10}}>
            <Text style={styles.label}>Company Address</Text>
            <TextInput  onChange={(e)=>setCompanyAddress(e.nativeEvent.text)} value={companyAddress}  style={styles.input} placeholder='Enter Company Address (5-15)' />
        </View>
        <View style={{marginBottom:10}}>
            <Text style={styles.label}>GSTIN Number</Text>
            <TextInput onChange={(e)=>setGstin(e.nativeEvent.text)} value={gstin} style={styles.input}  placeholder='Enter GST Address' />
        </View>
        <View style={styles.btn}>
            <Button title='Save' onPress={handlesubmit} />
        </View>
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
      btn:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        padding:20,
        marginTop:20
    }
})