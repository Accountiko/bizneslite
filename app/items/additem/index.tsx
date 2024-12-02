import { StyleSheet, Text, TextInput, View ,Button,Image, TouchableOpacity, ScrollView,Alert,ToastAndroid} from 'react-native'
import React, { useEffect } from 'react'
import Dropdown from 'react-native-input-select';
import { itemsType, useBillStore } from '@/context/bIllingContext';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/AntDesign'
import * as SQLite from 'expo-sqlite';

const index = () => {
    const navigate = useNavigation()
    const {id} = useLocalSearchParams()
    const [category, setCategory] = React.useState();
    const [name, setName] = React.useState("");
    const [image, setImage] = React.useState<string>();
    const [price, setPrice] = React.useState<number|undefined>();
    const [stock, setStock] = React.useState<number|undefined>();
    const [item, setItems] = React.useState<itemsType>();
    const [isTaxable,setIsTaxable] = React.useState<boolean>(false)
    const [itemtaxId,setItemTaxId] = React.useState()
    const {getCategorysFromDb,categorys,addItems,items,updateItem,getItemTaxFromDB,itemTax,getItemsFromDb,deleteItem} = useBillStore((state)=>(state))
    
    const getOneItem = async(id:number)=>{
        const db = await SQLite.openDatabaseAsync("main.db");
        const getitems :itemsType = await db.getFirstAsync('SELECT * FROM items WHERE id = ?;', id);
        
        if(getitems){
          setName(getitems.item_name)
          setPrice(getitems.item_price)
          setStock(getitems.stock)
          //@ts-ignore
          setCategory(getitems.category_id?.toString())
           //@ts-ignore 
          setIsTaxable(getitems.is_taxable ==1 ? true : false)
           //@ts-ignore
          setItemTaxId(getitems.item_tax_id?.toString())
          setImage(getitems.image)
          setItems(getitems)
        }
    }


    useEffect(() => {
      navigate.setOptions({ headerShown: true,headerTitle:'Add New Item' });
        getCategorysFromDb()
        getItemsFromDb()
        getItemTaxFromDB()
        if(id){
          getOneItem(parseInt(id.toString()))
            
        }
    },[])

    const categoryOptions = categorys.map(item => ({
        label: item.name,
        value: item.id.toString()
      }));

    const ItemTaxOptions = itemTax.map(item => ({
        label: `${item.tax_percentage} %`,
        value: item.id.toString()
    }))
    
      const handleDelete = () => {
        Alert.alert('Confirm', 'Do You Want to Delete This Item', [
          {
            text: 'Cancel',
            onPress: () => {
             
            },
            style: 'cancel', 
          },
          {text: 'Delete', onPress: async() => {
            deleteItem(parseInt(id.toString()))
            navigate.goBack()
              
          },style:'destructive'},
        ]);
        
      }

      const handleformvalidation = ()=>{
        if(!name){
            alert("Please Enter Item Name")
            return false
        }else if(!price){
            alert("Please Enter Item Price")
            return false
        }else if(!stock){
            alert("Please Enter Item Stock")
            return false
        }
        return true
      }

      const hanldeSave = () => {
        if(handleformvalidation()===false){
            return
        }

        if(id){
            //@ts-ignore
            updateItem({id:parseInt(id),item_name:name,item_price:price,stock:stock,category_id:category,is_taxable:isTaxable,item_tax_id:itemtaxId,image:image})
            setName("")
            setPrice(undefined)
            setStock(undefined)
            navigate.goBack()
        }else{
            addItems({item_name:name,item_price:price,stock:stock,category_id:category,is_taxable:isTaxable,item_tax_id:itemtaxId,image:image})
            setName("")
            setPrice(undefined)
            setStock(undefined)
            navigate.goBack()

        }
      
      }
      const handleUplaodImage = async()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
          quality:0.3
       
        });
        if(result.assets[0].fileSize > 3145728){
            alert("Image size should be less than 3mb")
            return
        }
        
        
        if (!result.canceled) {

        setImage(result.assets[0].base64)
        ToastAndroid.showWithGravity(
          'Image Uploaded Successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        }
      }

  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.label}>Enter the Item Name</Text>
        <TextInput
          value={name}
          onChange={(e) => setName(e.nativeEvent.text)}
          style={styles.input}
          placeholder="(ie. Pepsi)"
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.label}>Select the category</Text>
        <View
          style={{
            borderWidth: 2,
            borderColor: "#C0C0C0",
            borderRadius: 4,
            padding: 5,
          }}
        >
          <Dropdown
            placeholder="Select category"
            options={categoryOptions}
            selectedValue={category ? category : item?.category_id}
            onValueChange={(value: any) => setCategory(value)}
            primaryColor={"green"}
            placeholderStyle={{ color: "#C0C0C0" }}
            dropdownIconStyle={{ top: 8, right: 0 }}
          />
        </View>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.label}>Enter the Item Price (₹)</Text>

        <TextInput
          style={styles.input}
          value={price?.toString()}
          onChange={(e) => setPrice(Number(e.nativeEvent.text))}
          inputMode="numeric"
          placeholder="ie, ₹ 100"
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.label}>Enter the Stock Quantity </Text>
        <TextInput
          style={styles.input}
          value={stock?.toString()}
          onChange={(e) => setStock(Number(e.nativeEvent.text))}
          inputMode="numeric"
          placeholder="No of quanity"
        />
      </View>

      <View
        style={{
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 50,
        }}
      >
        {image ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${image}` }}
            style={{ width: 60, height: 60 }}
          />
        ) : (
          <TouchableOpacity
            onPress={handleUplaodImage}
            style={{
              width: 60,
              height: 60,
              borderColor: "#00BFFF",
              borderRadius: 5,
              borderWidth: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="cloudupload" size={32} color="#00BFFF" />
          </TouchableOpacity>
        )}

        {image ? (
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "green" }}>
            Successfully uploaded
          </Text>
        ) : (
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Uplaod Images
          </Text>
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" ,marginBottom:10,paddingVertical:5}}>
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
          placeholder="Select Tax percentage"
          options={ItemTaxOptions}
          selectedValue={itemtaxId ? itemtaxId : item?.item_tax_id}
          onValueChange={(value: any) => setItemTaxId(value)}
          primaryColor={"green"}
          placeholderStyle={{ color: "#C0C0C0" }}
            dropdownIconStyle={{ top: 8, right: 0 }}
        />
        </View>
      </View>
      )}

      <Button  title="Save" onPress={hanldeSave} />
      {id !=null && (
          <Button color={"#eb6359"} title="delete" onPress={handleDelete} />
      )}
     
    </ScrollView>
  );
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