const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave("FLWPUBK_TEST-f0e7f1c175bcc3c18e4064c7f6059909-X", "FLWSECK_TEST-00086f26dcd12bdd8c5790068bce4456-X"  );




const rw_mobile_money =  async (payload)=>{
 
    try {

        // const payload = {
        //     "tx_ref": "MC-158523s09v5050e8", //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
        //     "order_id": "USS_URG_893982923s2323", //Unique ref for the mobilemoney transaction to be provided by the merchant
        //     "amount": "1500",
        //     "currency": "RWF",
        //     "email": "olufemi@flw.com",
        //     "phone_number": "054709929220",
        //     "fullname": "John Madakin"
        // }

       const response =  await flw.MobileMoney.rwanda(payload)
       console.log(response);
    } catch (error) {
        console.log(error)
    }                            
   
}
const transferTobeneficiary =  async (details)=>{
 
    try {

        // account_bank: "MPS",
        // account_number: "2540782773934",
        // amount: 1200,
        // currency: "KES",
        // beneficiary_name: "Akinyi Kimwei",
        // meta: {
        //   "sender": "Flutterwave Developers",
        //   "sender_country": "ZA",
        //   "mobile_number": "23457558595"
        // }

        const response =  await flw.Transfer.initiate(details)
       console.log(response);
    } catch (error) {
        console.log(error)
    }                            
   
}
 module.exports={rw_mobile_money,transferTobeneficiary}
