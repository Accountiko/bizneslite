import { StyleSheet, Text, View,Image, TouchableOpacity,ToastAndroid } from 'react-native'
import React from 'react'
import { itemsType } from '@/context/bIllingContext'

const Item = ({item,itemPress}:{item:itemsType,itemPress:() => void}) => {
  function processItemName(itemName:string) {
    if (itemName.length <= 15) {
        return itemName;
    }
    return itemName.slice(0, 15) + '...';
}
    const handleOutofStock = ()=>{
      ToastAndroid.showWithGravity(
        'No Stock , Unable to add',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    
  return (
    <TouchableOpacity disabled={item?.stock==0} onPress={item?.stock==0?handleOutofStock : itemPress} style={styles.container} >
     {item.image!=null ? (
        <Image
          source={{
            uri: `data:image/jpeg;base64,${item.image}`,
          }}
          style={styles.image}
        />
      ) : (
        <Image
          source={require("../assets/item-default.png")}
          style={styles.image}
        />
      )}
      {/* <Image 
      style={styles.image}
      source={{
        uri:'https://bombaycatral.com/wp-content/uploads/2023/06/Untitled-1sdfsfscxzdasd.jpg'
      }}
       /> */}
       <Text style={styles.itemName}>{processItemName(item.item_name)}</Text>
       <Text style={styles.itemPrice}>₹ {item.item_price}</Text>
       <View style={{...styles.badge, backgroundColor:item.stock >=23?'green':'red',}}>
        <Text style={styles.badgeText}>{item.stock}</Text>
       </View>
    </TouchableOpacity>
  )
}

export default Item

const styles = StyleSheet.create({
    container:{
        width:100,
        height:100,
        backgroundColor:'white',
        borderRadius:10,
        overflow:'hidden',
        position:'relative',
        elevation:2

    },
    image:{
        width:'100%',
        height:65,
        objectFit:'cover'
    }
    ,
    itemName:{
        fontSize:12,
        fontWeight:'bold',
        marginLeft:5
    },
    itemPrice:{
        fontSize:10,
        marginLeft:5
    },
    badge:{
        // red for out of stock // orage for low stock
        width:30,
        height:20,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:5,
        left:5,
        padding:2
    },
    badgeText:{
        color:'white',
        fontSize:12,
        fontWeight:'bold'
    }
})