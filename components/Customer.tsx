import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Checkbox from 'expo-checkbox';


const Customer = () => {

   
  return (
    <View style={styles.conatiner}>
      <Text className='text-xs'>Customer</Text>
      <View className=' flex flex-row items-center'>
      <Checkbox
          style={styles.checkbox}
         
        
        />
      </View>
  
    </View>
  )
}

export default Customer

const styles = StyleSheet.create({
    conatiner :{
        padding:5,
        borderColor:'black',
        borderWidth:1
    },
    checkbox : {
       
    }
})