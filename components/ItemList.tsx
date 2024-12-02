import { Text, StyleSheet, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import Item from './Item'

export default class ItemList extends Component {
  render() {
    return (
      
        <ScrollView  style={styles.itemContainer} contentContainerStyle={{flexDirection:'row',flexWrap:'wrap',width:'100%',gap:15,paddingVertical:12}} >
      
        </ScrollView>
        
   
    )
  }
}

const styles = StyleSheet.create({
    itemContainer:{
        backgroundColor:'#dadada',
        height:'90%',
        borderRadius:10,
        paddingHorizontal:12,
        flexWrap:'wrap',
        flexDirection:'row',
        gap:15,
        width:'100%',
    }
})