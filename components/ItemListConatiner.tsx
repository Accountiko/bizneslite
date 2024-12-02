import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { itemsForListType } from '@/app/items'

const ItemListConatiner = ({items}:{items:itemsForListType}) => {
  return (
    <View style={styles.itemcontainer}>
      {items.image!=null ? (
        <Image
          source={{
            uri: `data:image/jpeg;base64,${items.image}`,
          }}
          style={{ width: 50, height: 50, borderRadius: 4 }}
        /> 
      ) : (
        <Image
          source={require("../assets/item-default.png")}
          style={{ width: 50, height: 50, borderRadius: 4 }}
        />
      )}
      <View style={styles.itemContent}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{items.item_name}</Text>
          <View
            style={{
              backgroundColor: "#90EE90",
              padding: 2,
              borderRadius: 5,
              opacity: 0.8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "400" }}> {items.stock}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
            {items.category_name!=null ?(
                <Text style={{ color: "#343434" }}>{items.category_name}</Text>
            ):(
                <Text style={{ color: "#343434" }}>nill</Text>
            )}
          
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>₹ {items.item_price}</Text>
            {items.item_tax_percentage!=null ?(
                 <Text style={{ fontSize: 12, fontWeight: "300" }}>{items.item_tax_percentage} %</Text>
            ):(
                <Text style={{ fontSize: 12, fontWeight: "300" }}>nill</Text>
            )}
           
          </View>
        </View>
      </View>
    </View>
  );
}

export default ItemListConatiner

const styles = StyleSheet.create({
    itemcontainer:{
        width:"95%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-evenly",
        backgroundColor:"#FFFFFF",
        padding:8,
        marginHorizontal:10,
        borderRadius:5,
        marginVertical:5,
        elevation:3
      },
      itemContent:{
      display:"flex",
      flexDirection:"column",
      justifyContent:"space-between",
      width:'80%'
      }
})