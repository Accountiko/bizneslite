import React, { useEffect, useState } from 'react'
import { View,Text, TouchableOpacity, ScrollView,ActivityIndicator } from 'react-native'
import { Link,useRouter,useFocusEffect } from 'expo-router';
import { Button } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Iconfa from 'react-native-vector-icons/FontAwesome';
import { useBillStore } from '@/context/bIllingContext';

interface reportTYpe { 
  total_sale : number,
  total_purchase : number,
  no_of_items : number
  no_of_sales : number
  no_of_purchases : number


}

function index() {
  const router = useRouter();
  const [reports,setReports] = useState<reportTYpe>()
  const {loading,setLoading} = useBillStore((state)=>(state))
 
  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }

  const runDB = async()=>{
    setLoading(true)
    const db = await SQLite.openDatabaseAsync("main.db");
    await db.execAsync(`
      create TABLE if not EXISTS category (
  id integer PRIMARY key AUTOINCREMENT,
  name varchar(50)
  );
  create TABLE if not EXISTS Item_tax(
  id integer PRIMARY key AUTOINCREMENT,
  tax_percentage float(3,2)
  );
     Create TABLE IF NOT EXISTS items (
  id integer PRIMARY key AUTOINCREMENT,
  item_name varchar(50),
  item_price integer,
  stock integer ,
  category_id integer ,
  is_taxable bool DEFAULT 0,
  item_tax_id integer,
  image varchar,
  FOREIGN key (item_tax_id) REFERENCES Item_tax(id),
  FOREIGN key (category_id) REFERENCES category(id)
  );
  CREATE table if NOT EXISTS saleinvoice (
  id integer PRIMARY key AUTOINCREMENT,
  qty integer DEFAULT  0 ,
  total_amount integer DEFAULT  0 ,
  payment_mode varchar(10),
  is_paid bool ,
  created_at DATETIME ,
  is_taxable bool DEFAULT 0 ,
  tax_percentage integer ,
  total_tax_amount integer 
  );
  create TABLE if NOT EXISTS orderitem (
  id integer PRIMARY key AUTOINCREMENT,
  saleinvoice_id integer,
  item_id integer ,
  qty integer ,
  amount integer ,
  item_tax_id integer,
  tax_amount integer,
  FOREIGN key (item_id) REFERENCES items(id),
  FOREIGN key (saleinvoice_id) REFERENCES saleinvoice(id),
  FOREIGN key (item_tax_id) REFERENCES Item_tax(id)
  );
   CREATE table if NOT EXISTS purchaseinvoice (
  id integer PRIMARY KEY AUTOINCREMENT,
  item_id integer ,
  qty integer ,
  total_amount integer ,
  created_at DateTime ,
  is_paid bool ,
  paid_amount integer ,
  is_taxable bool DEFAULT 0 ,
  tax_percentage integer,
  total_tax_amount integer ,
  FOREIGN KEY (item_id) REFERENCES items(id)
  );

  create TABLE if NOT EXISTS images (
id integer PRIMARY key AUTOINCREMENT,
name varchar(50),
base64 varchar
 
);
create TABLE if not EXISTS settings (
  id integer PRIMARY key AUTOINCREMENT,
  company_name varchar(255),
  company_address varchar(255),
  gstin varchar(255) ,
  is_gst_bill bool DEFAULT 0
  );


      `);
      setLoading(false)
  }

  const getReportData = async()=>{
    
    const db = await SQLite.openDatabaseAsync("main.db");
    const report :reportTYpe = await db.getFirstAsync(`
      SELECT 
    (SELECT COUNT(*) FROM items) AS no_of_items,
    (SELECT COUNT(*) FROM saleinvoice) AS no_of_sales,
    (SELECT COUNT(*) FROM purchaseinvoice) AS no_of_purchases,
    (SELECT SUM(CASE WHEN is_taxable = 1 THEN total_tax_amount ELSE total_amount END) 
     FROM saleinvoice 
      ) AS total_sale,
    (SELECT SUM(CASE WHEN is_taxable = 1 THEN total_tax_amount ELSE total_amount END) 
     FROM purchaseinvoice 
     ) AS total_purchase;
      `)
      setReports(report)
      console.log(report)
      
  }
  useFocusEffect(
    React.useCallback(() => {
      getReportData()
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []))

  useEffect(()=>{
    runDB()
    changeScreenOrientation()
  },[])
  
    let pl = reports?.total_sale || reports?.total_purchase ? parseInt((reports?.total_sale!=null? reports?.total_sale:0 - reports?.total_purchase!=null?reports.total_purchase:0).toFixed(2)) : 0
     pl = reports?.total_purchase == null? reports?.total_sale :pl

    if(loading){
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={'#FD673A'} size="large" />
        </View>
      )
    }
  
    return (
    <ScrollView>
      
      {/* for pos button  */}
      <TouchableOpacity
        onPress={() => router.push("/cart")}
        className="flex flex-col p-2 relative mt-3 "
      >
        <LinearGradient
          style={{ height: 100, borderRadius: 10 }}
          colors={["#f5af19", "#f12711"]}
        />
        <View className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  ">
          <Icon name="addfile" size={30} color="#fff" />
          <Text className="text-2xl font-bold text-white">Start Billing</Text>
        </View>
      </TouchableOpacity>
   
      {/* for purchase button  */}
      <TouchableOpacity
        onPress={() => router.push("/purchase/addpurchase")}
        className="flex flex-col p-2 relative "
      >
        <LinearGradient
          style={{ height: 100, borderRadius: 10 }}
          colors={["#f5af19", "#f12711"]}
        />
        <View className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  ">
          <Icons name="add-circle-outline" size={42} color="#fff" />
          <Text className="text-2xl font-bold text-white">
            Add Purchase Bill
          </Text>
        </View>
      </TouchableOpacity>
      <View className="flex flex-row flex-wrap justify-center items-center gap-4 px-3 py-4 ">
        <TouchableOpacity
          onPress={() => router.push("/items")}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          className="flex flex-col items-center justify-center  p-3 rounded-2xl bg-white w-24 "
        >
          <Icon name="shoppingcart" size={30} color="#000" />
          <Text>Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/category")}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          className="flex flex-col items-center justify-center  p-3 rounded-2xl bg-white w-24 "
        >
          <Icon name="filter" size={30} color="#000" />
          <Text>category</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/invoices")}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          className="flex flex-col items-center justify-center  p-3 rounded-2xl bg-white w-24 "
        >
          <Icon1 name="file-invoice-dollar" size={30} color="#000" />
          <Text>Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/purchase")}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          className="flex flex-col items-center justify-center  p-3 rounded-2xl bg-white w-24 "
        >
          <Icon1 name="dolly" size={30} color="#000" />
          <Text>Purchase</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          className="flex flex-col items-center justify-center  p-3 rounded-2xl bg-white w-24 "
        >
          <Icon name="areachart" size={30} color="#000" />
          <Text>Report</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
        onPress={()=>router.push('/settings')}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          className="flex flex-col items-center justify-center  p-3 rounded-2xl bg-white w-24 "
        >
          <Icon name="setting" size={30} color="#000" />
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>

      <View className="w-11/12   rounded p-3 m-auto flex flex-row  items-center justify-between gap-2">
        <View
          style={{ borderRadius: 10, borderWidth: 1, borderColor: "#3AB449" }}
          className="flex flex-col w-6/12 bg-white p-3  gap-1"
        >
          <View className="flex flex-row justify-between">
            <Text>Sales</Text>
            <Iconfa name="money" size={18} color="#3AB449" />
          </View>
          <View>
            <Text>₹ {(reports?.total_sale ? reports?.total_sale : 0).toFixed(2)}</Text>
          </View>
        </View>
        <View
          style={{ borderRadius: 10, borderWidth: 1, borderColor: "#1265BD" }}
          className="flex flex-col w-6/12 bg-white p-3  gap-1"
        >
          <View className="flex flex-row justify-between">
            <Text>Purchase</Text>
            <Iconfa name="money" size={18} color="#1265BD" />
          </View>
          <View>
            <Text>₹ {(reports?.total_purchase ? reports?.total_purchase : 0).toFixed(2)}</Text>
          </View>
        </View> 
        
      </View>
      <View className="w-11/12   rounded p-3 m-auto flex flex-row  items-center justify-between gap-2">
      <View
          style={{ borderRadius: 10, borderWidth: 1, borderColor: pl>0?"#3AB449":'red' }}
          className="flex flex-col w-full bg-white p-3  gap-1"
        >
          <View className="flex flex-row justify-between">
            <Text>Profit / loss</Text>
            <Icon name={pl>0?"caretup":"caretdown"} size={18} color={pl>0?"#3AB449":'red'} />
          </View> 
          <View>
            <Text style={{color:pl>0?"#3AB449":'red'}}>₹ {reports?.total_sale || reports?.total_purchase ? (reports?.total_sale - reports?.total_purchase).toFixed(2) : 0}</Text>
          </View>
        </View>
      </View>
      <View className="w-11/12   rounded p-3 m-auto flex flex-row  items-center justify-between ">
      <View
          style={{ borderRadius: 10, borderWidth: 1, borderColor: "#000" }}
          className="flex flex-col  bg-white p-3 "
        >
          <View className="flex flex-row justify-between gap-1">
            <Text>Items</Text>
            <Icon name="barcode" size={18} color="#000" />
          </View>
          <View>
            <Text style={{color:"#000"}}> {reports?.no_of_items?reports?.no_of_items:0} Nos</Text>
          </View>
        </View>
      <View
          style={{ borderRadius: 10, borderWidth: 1, borderColor: "#3AB449" }}
          className="flex flex-col  bg-white p-3  gap-1"
        >
          <View className="flex flex-row justify-between">
            <Text>Sales</Text>
            <Icon name="isv" size={18} color="#3AB449" />
          </View>
          <View>
            <Text style={{color:"#3AB449"}}>{reports?.no_of_sales?reports?.no_of_sales:0} Nos</Text>
          </View>
        </View>
      <View
          style={{ borderRadius: 10, borderWidth: 1, borderColor: "#3AB449" }}
          className="flex flex-col  bg-white p-3  gap-1"
        >
          <View className="flex flex-row justify-between">
            <Text> Purchase </Text>
            <Icon name="profile" size={18} color="#3AB449" />
          </View>
          <View>
            <Text style={{color:"#3AB449"}}>{reports?.no_of_purchases?reports?.no_of_purchases:0} Nos</Text>
          </View>
        </View>
      </View>

      {/*       
      <Button
        icon="shopping"
        mode="contained"
        onPress={() => router.push("/pos")}
      >
        POS
      </Button>
      <Button
        icon="shopping"
        mode="contained"
        onPress={() => router.push("/cart")}
      >
        Bill
      </Button>
      <Button onPress={() => router.push("/tests")}>test images</Button>
      <Button onPress={() => router.push("/invoices")}>All invocie</Button>
      <Button onPress={() => router.push("/items")}>All Items</Button>
      <Button onPress={() => router.push("/category")}>All categorys</Button>
      <Button onPress={() => router.push("/purchase")}>
        All Purchase invoice
      </Button> */}
    </ScrollView>
  );
}

export default index