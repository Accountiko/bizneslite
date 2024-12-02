import { create } from 'zustand'
import * as Print from 'expo-print';
import * as SQLite from 'expo-sqlite';
import Category from '@/components/Category';
import { settingTypes } from '@/app/settings';


export const PrintInvoice = async(id:any)=>{
    const db = await SQLite.openDatabaseAsync("main.db");
    const results :allSaleinvoiceType = await db.getFirstAsync('SELECT * FROM saleinvoice WHERE id = ?;', id);
    const settings :settingTypes = await db.getFirstAsync('select * from settings;')
    const orderItems: AllOrderItemsType[] =
              await db.getAllAsync(`SELECT orderitem.id, items.item_name, items.item_price, orderitem.qty, orderitem.amount, orderitem.saleinvoice_id ,orderitem.tax_amount
                                    FROM orderitem 
                                    JOIN items ON orderitem.item_id = items.id
                                    WHERE saleinvoice_id = ?;`, id);

    results.orderItems = orderItems
    if (results ==null){
        return
    }
    
//     const html = `<!DOCTYPE html>
// <html lang="en">

// <head>
//     <style>
//         body {
//             margin: 0;
//             padding: 0;
//             font-family: 'PT Sans', sans-serif;
//         }

//         @page {
//             size: 2.8in 11in;
//             margin-top: 0cm;
//             margin-left: 0cm;
//             margin-right: 0cm;
//         }

//         table {
//             width: 100%;
//         }

//         tr {
//             width: 100%;

//         }

//         h1 {
//             text-align: center;
//             vertical-align: middle;
//         }

//         #logo {
//             width: 60%;
//             text-align: center;
//             -webkit-align-content: center;
//             align-content: center;
//             padding: 5px;
//             margin: 2px;
//             display: block;
//             margin: 0 auto;
//         }

//         header {
//             width: 100%;
//             text-align: center;
//             -webkit-align-content: center;
//             align-content: center;
//             vertical-align: middle;
//         }

//         .items thead {
//             text-align: center;
//         }

//         .center-align {
//             text-align: center;
//         }

//         .bill-details td {
//             font-size: 12px;
//         }

//         .receipt {
//             font-size: medium;
//         }

//         .items .heading {
//             font-size: 12.5px;
//             text-transform: uppercase;
//             border-top:1px solid black;
//             margin-bottom: 4px;
//             border-bottom: 1px solid black;
//             vertical-align: middle;
//         }

//         .items thead tr th:first-child,
//         .items tbody tr td:first-child {
//             width: 47%;
//             min-width: 47%;
//             max-width: 47%;
//             word-break: break-all;
//             text-align: left;
//         }

//         .items td {
//             font-size: 12px;
//             text-align: right;
//             vertical-align: bottom;
//         }

//         .price::before {
//              content: "₹";
//             font-family: Arial;
//             text-align: right;
//         }

//         .sum-up {
//             text-align: right !important;
//         }
//         .total {
//             font-size: 13px;
//             border-top:1px dashed black !important;
//             border-bottom:1px dashed black !important;
//         }
//         .total.text, .total.price {
//             text-align: right;
//         }
//         .total.price::before {
//             content: "₹"; 
//         }
//         .line {
//             border-top:1px solid black !important;
//         }
//         .heading.rate {
//             width: 20%;
//         }
//         .heading.amount {
//             width: 25%;
//         }
//         .heading.qty {
//             width: 5%
//         }
//         p {
//             padding: 1px;
//             margin: 0;
//         }
//         section, footer {
//             font-size: 12px;
//         }
//     </style>
// </head>

// <body>
//     <header>
//         <div id="logo" class="media" data-src="logo.png" src="./logo.png"></div>

//     </header>
//     <h5 style="text-align:center">${settings?.company_name}</h5>
//     <p style="display:${results?.is_taxable == true ? "block" : "none"}">GST Number : ${settings?.gstin}</p>
//     <table class="bill-details">
//         <tbody>
//             <tr>
//                 <td>Invoice # : <span>${results.id}</span></td>
                
//             </tr>
//             <tr>
//                 <td>Date : <span>${results.created_at}</span></td>
//             </tr>
            
//             <tr>
//                 <th class="center-align" colspan="2"><span class="receipt">Original Receipt</span></th>
//             </tr>
//         </tbody>
//     </table>
    
//     <table class="items">
//         <thead>
//             <tr>
//                 <th class="heading name">Item</th>
//                 <th class="heading qty">Qty</th>
//                 <th class="heading rate">Rate</th>
//                 <th class="heading amount">Amount</th>
//             </tr>
//         </thead>
       
//         <tbody>
//           ${results?.orderItems?.map((i)=>`
//                <tr>
//                 <td>${i.item_name}</td>
//                 <td>${i.qty}</td>
//                 <td class="price">${i.item_price}</td>
//                 <td class="price">${i.amount.toFixed(2)}</td>
//             </tr>
//                     `)}
            
          
//             <tr>
//                 <td colspan="3" class="sum-up line">Subtotal</td>
//                 <td class="line price">
//                 ${results.total_amount.toFixed(2)}
//                 </td>
//             </tr>
//             ${results.is_taxable == true ? `
//             <tr>
//                 <td colspan="3" class="sum-up">CGST</td>
//                 <td class="price">${((results.total_tax_amount-results.total_amount)/2).toFixed(2)}</td>
//             </tr>
//             <tr>
//                 <td colspan="3" class="sum-up">SGST</td>
//                 <td class="price">${((results.total_tax_amount-results.total_amount)/2).toFixed(2)}</td>
//             </tr>
//                 ` :`
//                 `}
            
//             <tr>
//                 <th colspan="3" class="total text">Total</th>
//                 <th class="total price">${results.is_taxable == true ? results.total_tax_amount.toFixed(2) : results.total_amount.toFixed(2)}</th>
//             </tr>
//         </tbody>
//     </table>
//     <section>
//         <p>
//             Paid by : <span>${results.payment_mode}</span>
//         </p>
//         <p style="text-align:center">
//             Thank you for your visit!
//         </p>
//     </section>
//     <footer style="text-align:center;margin-bottom:30px">
//         <p>${settings?.company_address}</p>
//     </footer>
// </body>

// </html>`;

const html = `<!DOCTYPE html>
<html lang="ta">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>58mm Thermal Printer Table</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 24px; /* Small font size for thermal printer */
            margin: 0;
            padding: 0;
        }
        table {
            width: 100%; /* Fit within 58mm width */
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000;
            padding: 2px;
            text-align: left;
            word-wrap: break-word; /* Handle long text */
        }
        th {
            font-weight: bold;
        }
            
    </style>
</head>
<body>
<p style="text-align:center;font-weight:bold;font-size:30px"> J.V. JOHN VINCENT</p>
<p style="text-align:center;font-weight:bold;font-size:30px"> DECEMBER 2024</p>
<p style="text-align:center;font-weight:bold;font-size:30px"> Kumar Store </p>
    <table>
        <thead>
            <tr>
                <th>பொருள்</th>
                <th>அளவு</th>
                <th>விலை</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>மணச்சநல்லூர் பொன்னி</td><td>17 Kg</td><td></td></tr>
            <tr><td>இட்லி அரிசி புழுங்கல்</td><td>8 kg</td><td></td></tr>
            <tr><td>து. பருப்பு</td><td>2 1/2 Kg</td><td></td></tr>
            <tr><td>தோ.உளுந்தம் பருப்பு</td><td>1 kg</td><td></td></tr>
            <tr><td>கடலைப்பருப்பு</td><td>750 g</td><td></td></tr>
            <tr><td>பாசிப்பருப்பு</td><td>1 kg</td><td></td></tr>
            <tr><td>வெள்ளை உளுந்து பருப்பு</td><td>1/2 kg</td><td></td></tr>
            <tr><td>கடுகு</td><td>250 g</td><td></td></tr>
            <tr><td>வெந்தயம்</td><td>150 g</td><td></td></tr>
            <tr><td>சோம்பு</td><td>100 g</td><td></td></tr>
            <tr><td>சீரகம்</td><td>300 g</td><td></td></tr>
            <tr><td>மிளகு</td><td>100 g</td><td></td></tr>
            <tr><td>முழுமல்லி</td><td>1 kg</td><td></td></tr>
            <tr><td>மிளகாய் வத்தல்</td><td>250 g</td><td></td></tr>
            <tr><td>கசகசா</td><td>50 g</td><td></td></tr>
            <tr><td>கல் உப்பு</td><td>3 pkt</td><td></td></tr>
            <tr><td>சாம்பார் பொடி</td><td>150 g</td><td></td></tr>
            <tr><td>மஞ்சள் தூள்</td><td>150 g</td><td></td></tr>
            <tr><td>ரவா</td><td>1/2 kg</td><td></td></tr>
            <tr><td>3 roses டீ தூள்</td><td>250 g</td><td></td></tr>
            <tr><td>பொட்டுக்கடலை</td><td>3/4 kg</td><td></td></tr>
            <tr><td>நாட்டுச்சக்கரை</td><td>1 kg</td><td></td></tr>
            <tr><td>Vim சோப்பு (10 rs)</td><td>2 </td><td></td></tr>
            <tr><td>Vim லிக்யூட் (15 rs)</td><td>1</td><td></td></tr>
            <tr><td>பச்சைபயிறு</td><td>1/2 kg</td><td></td></tr>
            <tr><td>கருப்பு சுண்டல்</td><td>1/2 kg</td><td></td></tr>
            <tr><td>பச்சை பட்டாணி</td><td>1/2 kg</td><td></td></tr>
            <tr><td>மைதா</td><td>1/2 kg</td><td></td></tr>
            <tr><td>அப்பளம் சிறியது</td><td>2 nos</td><td></td></tr>
            <tr><td>கடலை மாவு</td><td>250 g</td><td></td></tr>
            <tr><td>போண்டா மிக்ஸ்</td><td>250 g</td><td></td></tr>
            <tr><td>silver பிரஸ்</td><td>1 no</td><td></td></tr>
            <tr><td>Total:</td><td></td><td>₹ </td></tr>
        </tbody>
    </table>
</body>
</html>
`

      await Print.printAsync({
            html
             // iOS only
          });
}




interface OrderitemType {
    id:number
    name : string
    price : number
    qty : number
    amount : number,
    item_tax_id ?:number
    tax_amount? :number

}
interface CategoryType{
    id:number
    name:string
}

export interface itemsType {
    id?:number
    item_name :string
    item_price :number
    stock :number
    image?:string
    category_id :number,
    is_taxable :boolean
    item_tax_id ?:number
}

interface ItemTaxType {
    id:number
    tax_percentage :number
}

interface saleInvocieType {
    invoiceId:number
    qty:number 
    totalAmount:number
    paymentMode :string
    saleItems?:OrderitemType[]
    is_paid:boolean
    is_taxable : boolean 
    tax_percentage? :number
    total_tax_amount ?:number
    
}

interface AllOrderItemsType {
    id:number
    item_name:string
    item_price:number
    qty:number
    amount:number
    saleinvoice_id:number
    tax_amount?:number
}
export interface allSaleinvoiceType {
    id:number
    qty:number
    total_amount:number
    payment_mode :string
    is_paid :boolean
    created_at :string
    orderItems : AllOrderItemsType[]
    is_taxable :boolean
    total_tax_amount:number

}

export interface allPurchaseInvoiceType {
    id?:number
    item_name?:string
    item_id?:string
    qty:number
    total_amount:number
    created_at? :string
    is_paid :boolean
    paid_amount :number
    is_taxable:boolean
    tax_percentage?:number
    total_tax_amount?:number
    item_price?:number


}
interface useBillStoreType {
    items : itemsType[]
    itemTax :ItemTaxType[]
    categorys: CategoryType[],
    orderitems : OrderitemType[]
    sale_invocie:saleInvocieType

    loading :boolean

    all_sale_invocie : allSaleinvoiceType[]
    all_purchase_invoice:allPurchaseInvoiceType[]

    getAllPurchaseInvoices : ()=>void
    addPurchaseInvoice : (item:allPurchaseInvoiceType) => void

    getItemsFromDb : () => void
    getItemTaxFromDB : () => void
    getCategorysFromDb : () => void
    getSaleInvocie : () => void
    deleteSaleInvocie : () => void
    deleteItem : (id:number) => void
    updateItem : (item:itemsType) => void

    addItems : (item : itemsType) => void
    addOrderItem : (item : OrderitemType) => void
    addCategory : (categoryName : string) => void
    deleteCategory : (id:number) => void
    qtyIncr :(id:number,item_tax_id?:number)=>void
    qtyDecr:(id:number,item_tax_id?:number)=>void
    removeItem : (id:number,item_tax_id?:number)=>void
    setPaymentMode : (mode:string)=>void
    setTaxableToInvoice : (is_taxable:boolean)=>void
    Checkout : () => void
    getAllSaleInvoice : (limit?:number) => void
    setLoading : (value:boolean) => void

}

export const useBillStore = create<useBillStoreType>((set,get) => ({
    items : [],
    itemTax :[],
    orderitems : [],
    categorys : [],
    sale_invocie : {
        invoiceId:1,
        qty:0,
        totalAmount:0,
        paymentMode:'cash',
        is_paid:false,
        is_taxable:false,
        total_tax_amount:0,
        tax_percentage:0,
    },
    all_sale_invocie : [],
    all_purchase_invoice : [],
    loading:false,

    setLoading : (value:boolean) =>{
        set((state)=>({
            loading : value
        }))
    },


    getAllPurchaseInvoices : async()=>{
        const db = await SQLite.openDatabaseAsync("main.db");
        var results :allPurchaseInvoiceType[] = await db.getAllAsync('SELECT * from purchaseinvoice;')

        set((state)=>({
            all_purchase_invoice: [...results]
        }))

    },
    addPurchaseInvoice : async(item:allPurchaseInvoiceType) => {
        const db = await SQLite.openDatabaseAsync("main.db");
        if(item.is_taxable){
            const results = await db.runAsync("INSERT INTO purchaseinvoice(item_id, qty, total_amount, created_at, is_paid, paid_amount,is_taxable,tax_percentage,total_tax_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",item.item_id,item.qty,item.total_amount,new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),item.is_paid,item.paid_amount,item.is_taxable,item.tax_percentage,item.total_tax_amount);
            await db.runAsync(`UPDATE items SET stock = stock + ? WHERE id = ?;`,item.qty,item.item_id);
            set((state)=>({
                all_purchase_invoice : [...state.all_purchase_invoice,{id:results.lastInsertRowId,...item}]
            }))
            
        }else{
            const results = await db.runAsync("INSERT INTO purchaseinvoice(item_id, qty, total_amount, created_at, is_paid, paid_amount) VALUES (?, ?, ?, ?, ?, ?);",item.item_id,item.qty,item.total_amount,new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),item.is_paid,item.paid_amount);
            await db.runAsync(`UPDATE items SET stock = stock + ? WHERE id = ?;`,item.qty,item.item_id);
            set((state)=>({
                all_purchase_invoice : [...state.all_purchase_invoice,{id:results.lastInsertRowId,...item}]
            }))
        }
       
    },

    getSaleInvocie : async() => {
        console.log("created sale invocie")
        const db = await SQLite.openDatabaseAsync("main.db");
        const results = await db.runAsync("INSERT INTO saleinvoice(payment_mode, is_paid) VALUES (?, ?);", "cash", 0);
        const setttings :settingTypes = await db.getFirstAsync('select * from settings; ')
        console.log(results.lastInsertRowId)
        set((state)=>({
            sale_invocie : {invoiceId:results.lastInsertRowId,qty:0,totalAmount:0,paymentMode:'cash',is_paid:false,is_taxable:setttings?setttings.is_gst_bill==0?false:true:false,total_tax_amount:0}
        }))

       
    },
    deleteSaleInvocie : async() => {
        const db = await SQLite.openDatabaseAsync("main.db");
        const results = await db.runAsync("DELETE FROM saleinvoice WHERE id = ?;", get().sale_invocie.invoiceId);
        set((state)=>({
            orderitems:[]
        }))
    },
    getCategorysFromDb : async()=> {
        const db = await SQLite.openDatabaseAsync("main.db");
        const allitemsfromcat :CategoryType[] = await db.getAllAsync('SELECT * FROM category');
        set(()=>({
            categorys : [...allitemsfromcat]
        }))
    },
    addCategory : async(categoryName:string) => {
        console.log(categoryName)
        const db = await SQLite.openDatabaseAsync("main.db");
        const results = await db.runAsync("INSERT into category(name) VALUES (?);", categoryName);
        console.log(results.lastInsertRowId)
        set((state)=>({
            categorys : [...state.categorys,{id:results.lastInsertRowId,name:categoryName}]
        }))
    },
    deleteCategory : async(id:number) => {
        const db = await SQLite.openDatabaseAsync("main.db");
        await db.runAsync("DELETE FROM category WHERE id = ?;", id);
        set((state)=>({
            categorys : state.categorys.filter((i)=>i.id != id)
        }))
    },

    getItemTaxFromDB : async() => {
        const db = await SQLite.openDatabaseAsync("main.db");
        const allitemsfromtax :ItemTaxType[] = await db.getAllAsync('SELECT * FROM Item_tax');
        set(()=>({
            itemTax : [...allitemsfromtax]
        }))

    },

    getItemsFromDb : async()=> {
        const db = await SQLite.openDatabaseAsync("main.db");
        const allitems :itemsType[] = await db.getAllAsync('SELECT * FROM items');
        set(()=>({
            items : [...allitems]
        }))
    } ,

    addItems : async(items:itemsType) => {
        console.log(items)
        const db = await SQLite.openDatabaseAsync("main.db");
        const results = await db.runAsync("INSERT INTO items(item_name, item_price, stock,category_id,is_taxable,item_tax_id,image) VALUES (?, ?, ?, ?,?,?,?);", items.item_name, items.item_price, items.stock, items.category_id,items.is_taxable, items.item_tax_id,items.image);
        console.log(results.lastInsertRowId)
        set((state)=>({
            items : [...state.items,{id:results.lastInsertRowId,...items}]
        }))
    },
    deleteItem : async(id:number) => {
        const db = await SQLite.openDatabaseAsync("main.db");
        await db.runAsync("DELETE FROM items WHERE id = ?;", id);
        set((state)=>({
            items : state.items.filter((i)=>i.id != id)
        }))
    },
    updateItem : async(item:itemsType) => {
        const db = await SQLite.openDatabaseAsync("main.db");
        const results = await db.runAsync("UPDATE items SET item_name = ?, item_price = ?, stock = ?, category_id = ?,is_taxable = ?, item_tax_id = ?,image = ? WHERE id = ?;", item.item_name, item.item_price, item.stock, item.category_id,item.is_taxable, item.item_tax_id, item.image, item.id);
        set((state)=>({
            items : state.items.map((i)=>i.id == item.id ? item : i)
        }))
    },
    addOrderItem : (item : OrderitemType) => {
        var tax = get().itemTax.find((i)=>i.id == item.item_tax_id)
        if(get().sale_invocie.is_taxable){
            if(item.item_tax_id){
                set((state) => ({ 
                    orderitems : [...state.orderitems,item],
                    sale_invocie : {...state.sale_invocie,qty:state.sale_invocie.qty+1,totalAmount:(state.sale_invocie.totalAmount+item.price),tax_percentage:state.sale_invocie.tax_percentage!=0?parseFloat(((state.sale_invocie.tax_percentage + tax.tax_percentage)/2).toFixed(2)):tax.tax_percentage,total_tax_amount:state.sale_invocie.total_tax_amount+item.tax_amount}
                 }))
            }else {
             
                 set((state) => ({ 
                    orderitems : [...state.orderitems,{...item,tax_amount :item.amount} ],
                    sale_invocie : {...state.sale_invocie,qty:state.sale_invocie.qty+1,totalAmount:state.sale_invocie.totalAmount+item.price,tax_percentage:0,total_tax_amount:state.sale_invocie.total_tax_amount+item.amount}
                 }))
                
            }
            
          

             console.log(get().sale_invocie)
        }else {
            set((state) => ({ 
                orderitems : [...state.orderitems, item],
                sale_invocie : {...state.sale_invocie,qty:state.sale_invocie.qty+1,totalAmount:state.sale_invocie.totalAmount+item.price}
             }))
        }
     
    } ,
    qtyIncr :(id:number,item_tax_id?:number)=>{
        var tax = get().itemTax.find((i)=>i.id == item_tax_id)
        console.log(tax,'from increment')
        if(get().sale_invocie.is_taxable){
            if(item_tax_id){
                set((state)=>({
                    orderitems : state.orderitems.map((i)=>i.id == id ? {...i,qty:i.qty+1,amount:i.price*(i.qty+1),tax_amount:((i.price*(i.qty+1)) + (i.price * (tax?.tax_percentage/100)) * (i.qty+1))} : i),
                    sale_invocie : {...state.sale_invocie,qty:state.sale_invocie.qty+1,totalAmount:state.sale_invocie.totalAmount+state.orderitems.find((i)=>i.id == id)?.price,total_tax_amount:(state.sale_invocie.total_tax_amount+state.orderitems.find((i)=>i.id == id)?.price + state.orderitems.find((i)=>i.id == id)?.price * (tax?.tax_percentage/100))}
                }))
            }else{
                set((state)=>({
                    orderitems : state.orderitems.map((i)=>i.id == id ? {...i,qty:i.qty+1,amount:i.price*(i.qty+1),tax_amount:(i.price*(i.qty+1))} : i),
                    sale_invocie : {...state.sale_invocie,qty:state.sale_invocie.qty+1,totalAmount:state.sale_invocie.totalAmount+state.orderitems.find((i)=>i.id == id)?.price,total_tax_amount:(state.sale_invocie.totalAmount+state.orderitems.find((i)=>i.id == id)?.price)}
                }))
            }
        
        }else{
            set((state)=>({
                orderitems : state.orderitems.map((i)=>i.id == id ? {...i,qty:i.qty+1,amount:i.price*(i.qty+1)} : i),
                sale_invocie : {...state.sale_invocie,qty:state.sale_invocie.qty+1,totalAmount:state.sale_invocie.totalAmount+state.orderitems.find((i)=>i.id == id)?.price}
            }))
        }
        },
    qtyDecr:(id:number,item_tax_id?:number)=>{
        var tax = get().itemTax.find((i)=>i.id == item_tax_id)
        if(get().sale_invocie.is_taxable){
            if(item_tax_id){
                set((state) => ({
                    orderitems: state.orderitems.map((i) => i.id == id ? { ...i, qty: i.qty - 1, amount: i.price * (i.qty - 1),tax_amount:((i.tax_amount) -  (i.price + (i.price * (tax?.tax_percentage/100))))} : i),
                    sale_invocie: { ...state.sale_invocie, qty: state.sale_invocie.qty - 1, totalAmount: state.sale_invocie.totalAmount - state.orderitems.find((i) => i.id == id)?.price ,total_tax_amount:(state.sale_invocie.total_tax_amount - (state.orderitems.find((i)=>i.id == id)?.price + (state.orderitems.find((i)=>i.id == id)?.price * (tax?.tax_percentage/100))))}
                }))
            }else{
                set((state) => ({
                    orderitems: state.orderitems.map((i) => i.id == id ? { ...i, qty: i.qty - 1, amount: i.price * (i.qty - 1),tax_amount:(i.price * (i.qty - 1))} : i),
                    sale_invocie: { ...state.sale_invocie, qty: state.sale_invocie.qty - 1, totalAmount: state.sale_invocie.totalAmount - state.orderitems.find((i) => i.id == id)?.price ,total_tax_amount: (state.sale_invocie.totalAmount - state.orderitems.find((i) => i.id == id)?.price) }
                }))
            }
          
        }else {
            set((state) => ({
                orderitems: state.orderitems.map((i) => i.id == id ? { ...i, qty: i.qty - 1, amount: i.price * (i.qty - 1) } : i),
                sale_invocie: { ...state.sale_invocie, qty: state.sale_invocie.qty - 1, totalAmount: state.sale_invocie.totalAmount - state.orderitems.find((i) => i.id == id)?.price }
            }))
        }

      
},
    removeItem : (id:number,item_tax_id?:number)=>{
        if(item_tax_id){
            set((state)=>({
                orderitems : state.orderitems.filter((i)=>i.id != id),
                sale_invocie: {...state.sale_invocie,qty:state.sale_invocie.qty-state.orderitems.find((i)=>i.id == id)?.qty,totalAmount:state.sale_invocie.totalAmount-state.orderitems.find((i)=>i.id == id)?.amount,total_tax_amount:state.sale_invocie.total_tax_amount-state.orderitems.find((i)=>i.id == id)?.tax_amount}
            }))
        }else{
            set((state)=>({
                orderitems : state.orderitems.filter((i)=>i.id != id),
                sale_invocie: {...state.sale_invocie,qty:state.sale_invocie.qty-state.orderitems.find((i)=>i.id == id)?.qty,totalAmount:state.sale_invocie.totalAmount-state.orderitems.find((i)=>i.id == id)?.amount,total_tax_amount:state.sale_invocie.total_tax_amount-state.orderitems.find((i)=>i.id == id)?.amount}
            }))
        }
      

    } ,
    setPaymentMode : (mode:string)=>set((state)=>({
        sale_invocie : {...state.sale_invocie,paymentMode:mode}
    })),
    setTaxableToInvoice : (is_taxable:boolean)=>set((state)=>({
        sale_invocie : {...state.sale_invocie,is_taxable}
    })),
    Checkout : async() => { 
        const db = await SQLite.openDatabaseAsync("main.db");
        const orderItemeget = get().orderitems
        const saleinvoiceget = get().sale_invocie
        var taxs = get().itemTax
        // console.log(orderItemeget,'orderItems')
        // console.log(saleinvoiceget,'saleinvoice')
       
        const taxLookup = taxs.reduce((acc, rate) => {
            acc[rate.id] = rate.tax_percentage;
            return acc;
          }, {});
          const { totalTax } = orderItemeget.reduce(
            (acc, item) => {
              const taxPercentage = item.item_tax_id !== null ? taxLookup[item.item_tax_id] : null;
              if (taxPercentage !== null) {
                acc.totalTax += taxPercentage;
                acc.count += 1;
              }
              return acc;
            },
            { totalTax: 0, count: 0 }
          );

          console.log(totalTax,'taxlookup')
       
        set((state) => ({
        sale_invocie :{...state.sale_invocie,saleItems:state.orderitems,is_paid:true,tax_percentage:totalTax}
        }))
       
       
        orderItemeget.forEach(async(i)=>{
            if(i.item_tax_id){
                const results = await db.runAsync("INSERT INTO orderitem (saleinvoice_id,item_id,qty,amount,item_tax_id,tax_amount) VALUES (?, ? ,? ,?,?,?);", saleinvoiceget.invoiceId, i.id, i.qty, i.amount,i.item_tax_id,i.tax_amount);
                await db.runAsync(`UPDATE items SET stock = stock - ? WHERE id = ?;`,i.qty,i.id)
                console.log(results.lastInsertRowId)
            }else{
                const results = await db.runAsync("INSERT INTO orderitem (saleinvoice_id,item_id,qty,amount) VALUES (?, ? ,? ,?);", saleinvoiceget.invoiceId, i.id, i.qty, i.amount);
                await db.runAsync(`UPDATE items SET stock = stock - ? WHERE id = ?;`,i.qty,i.id)
                console.log(results.lastInsertRowId)
            }
            
        })
        if(saleinvoiceget.is_taxable){
            const salefinal = await db.runAsync('UPDATE saleinvoice SET is_paid = ? ,qty = ?, total_amount = ? , payment_mode = ? ,created_at = ?,is_taxable = ?, tax_percentage= ?,total_tax_amount = ? WHERE id = ?;', 1, saleinvoiceget.qty, saleinvoiceget.totalAmount, saleinvoiceget.paymentMode,new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),saleinvoiceget.is_taxable,totalTax,saleinvoiceget.total_tax_amount, saleinvoiceget.invoiceId);
            console.log(salefinal.lastInsertRowId)
        }else{
            const salefinal = await db.runAsync('UPDATE saleinvoice SET is_paid = ? ,qty = ?, total_amount = ? , payment_mode = ? ,created_at = ? WHERE id = ?;', 1, saleinvoiceget.qty, saleinvoiceget.totalAmount, saleinvoiceget.paymentMode,new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), saleinvoiceget.invoiceId);
            console.log(salefinal.lastInsertRowId)

        }
        PrintInvoice(saleinvoiceget.invoiceId)
        get().getSaleInvocie()
        get().getItemsFromDb()
        set({orderitems:[]})

        
      
    },

    getAllSaleInvoice : async(limit:number=1) => {
        console.log("called")
        const db = await SQLite.openDatabaseAsync("main.db");
        const allitems: allSaleinvoiceType[] = await db.getAllAsync('SELECT * FROM saleinvoice ORDER BY id DESC LIMIT ?;',12*limit);
        // console.log(allitems);
        
        for (const i of allitems) {
            const results: AllOrderItemsType[] =
              await db.getAllAsync(`SELECT orderitem.id, items.item_name, items.item_price, orderitem.qty, orderitem.amount, orderitem.saleinvoice_id ,orderitem.tax_amount
                                    FROM orderitem 
                                    JOIN items ON orderitem.item_id = items.id
                                    WHERE saleinvoice_id = ?;`, i.id);
            
            // console.log(results);
            const saleInvoice = allitems?.find((j) => j.id === i.id);
            if (saleInvoice) {
                saleInvoice.orderItems = results;
            }
            // console.log(allitems.find((j) => j.id === i.id));
        }
        // console.log(allitems);

        set({all_sale_invocie:allitems})
        
    }

}))