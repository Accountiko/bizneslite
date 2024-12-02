import { View, Text,StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import React, { useEffect } from 'react'
import { SegmentedButtons,Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBillStore } from '@/context/bIllingContext';

interface propsType {
    activteCat:number|null,
    setActivteCat : React.Dispatch<React.SetStateAction<number|null>>
}
const Category = ({activteCat,setActivteCat}:propsType) => {
    // const [category, setCategory] = React.useState()
    const {categorys,getCategorysFromDb} = useBillStore((state) => (state))
    useEffect(()=>{
        getCategorysFromDb()
        if(categorys[0]?.id !=0){
            
        }
    },[])
  return (
 
    <ScrollView horizontal={true} style={styles.catcontainer} >
         <TouchableOpacity onPress={()=>setActivteCat(null)}  style={activteCat==null?styles.catActivebtn:styles.catButton}>
                  <Text style={activteCat==null?styles.activebtnText:styles.btntext}>All</Text>
              </TouchableOpacity>
          {categorys?.map((item) => (
              <TouchableOpacity onPress={()=>setActivteCat(item.id)} key={item.id} style={item.id==activteCat?styles.catActivebtn:styles.catButton}>
                  <Text style={item.id==activteCat?styles.activebtnText:styles.btntext}>{item.name}</Text>
              </TouchableOpacity>
          ))}
    </ScrollView>
    
  )
}
const styles = StyleSheet.create({
    catcontainer :{
     marginBottom:0
        
    },
    catButton:{
        height:22,
        minWidth:30,
        borderRadius:12,
        borderBlockColor:'black',
        borderWidth:1,
        paddingHorizontal:5,
        marginRight:10,
        marginBottom:10
        
    },
    catActivebtn : {
        backgroundColor:'black',
        color:'white',
        height:22,
        minWidth:30,
        borderRadius:12,
        paddingHorizontal:5,
        marginRight:10,
        marginBottom:10
    },
    btntext:{
        color:'black',
        textAlign:'center'
    },
    activebtnText:{
        color:'white'
    }
})
export default Category