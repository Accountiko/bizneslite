import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useBillStore } from '@/context/bIllingContext'
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from 'expo-router';

const index = () => {
  const navigation = useNavigation()
    const {categorys,getCategorysFromDb,addCategory,deleteCategory} = useBillStore((state)=>(state))
    const [modalshow,setModalshow] = useState(false)
    const [categoryName,setCategoryName] = useState("")
    useEffect(() => {
      navigation.setOptions({ headerShown: true,headerTitle:'All Categories' });
        getCategorysFromDb()
    },[])
    const handleCancel = () => {
        setModalshow(false)
        setCategoryName("")
    }
    const handleSave = () => {
        
            addCategory(categoryName)
            setModalshow(false)
            setCategoryName("")
      
    }
  return (
    <View>
      
      <Modal animationType='slide' transparent  visible={modalshow}
      style={{display:"flex",justifyContent:"center",alignItems:"center",flex:1}}
      onRequestClose={() => {
        setModalshow(!modalshow);
      }}
      >
        <View style={styles.modalcontainer}>
            <Text style={{fontSize:20,fontWeight:"bold"}}>Add Category </Text>
            <TextInput value={categoryName} onChange={(e)=>setCategoryName(e.nativeEvent.text)} placeholder='Category Name' />
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}><Button color={'#eb6359'} onPress={handleCancel} title='cancel' /><Button onPress={handleSave}  title='Save' /></View>
            
        </View>

      </Modal>
      <Button title='Add Category' onPress={()=>setModalshow(true)} />
      <ScrollView style={{width:"100%"}}>
        {categorys?.map((i)=>(
          <View key={i.id} style={styles.categoryitemConatiner}> 
              <Text style={{fontSize:16,fontWeight:"bold"}}>{i.name}  </Text>
              <TouchableOpacity onPress={()=>{deleteCategory(i.id)}}>
              <Icon name='delete' size={22} color='red' />
              </TouchableOpacity>
              
          </View>
      ))}

      </ScrollView>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    modalcontainer : {
        display:"flex",
        width:"70%",
        height:"30%",
        margin:"auto",
        borderRadius:10,
        borderColor:"black",
        borderWidth:1,
        padding:10,
        justifyContent:"space-between",
        backgroundColor:"white",
        
        
    },
    categoryitemConatiner :{
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      padding:10,
      margin:5,
      backgroundColor:'white',
      elevation:3,
      borderRadius:5
    }
})