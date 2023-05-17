import Queue from 'bull';
import Klaviyo from 'klaviyo-node';
import {id} from '../server.js';
import {Client} from 'klaviyo-api';
import {connection } from '../controllers/appSettingsController.js';
import { kapikey,formid } from '../server.js';

let klaviyoKeys={};

const klaviyo = new Klaviyo({
    apiKey:'pk_d033081e07671da0493b729a08b01619d9'
  });
  
const klaviyoQueue = new Queue('klaviyo');

klaviyoQueue.process(async (job) => {
  console.log("Forms id:"+formid)
  try {
    const [rows, fields] = await connection.promise().execute(`SELECT klaviyoIntegration FROM forms WHERE id=?`, [formid]);
    
    rows.forEach(row => {
      const klaviyoData = JSON.parse(row.klaviyoIntegration);
      console.log(klaviyoData.klaviyoListMapping);
      klaviyoKeys = Object.keys(klaviyoData.klaviyoListMapping);
      console.log(klaviyoKeys);
    });
    
    console.log(job.data.fields);
    const values = Object.values(job.data.fields);
    let properties = {};
    
    for (let i = 0; i < klaviyoKeys.length; i++) {
      console.log(klaviyoKeys[i] + ": " + values[i]);
      if (klaviyoKeys[i] === "email") {
        properties[klaviyoKeys[i]] = job.data.fields.Text; // Assuming the email value is in the "Text" field
      } else {
        properties[klaviyoKeys[i]] = values[i];
      }
    }
    
    console.log("IDS: " + id);
    console.log(properties);
    // console.log(klaviyoFields)
   
    await Client.createClientSubscription( JSON.stringify(
      {
        data:{
        type: "subscription",
        attributes: {
        list_id: id ,
        custom_source:'Client Subscription',
          email: job.data.fields.Text,
          //phone_number: job.data.fields.Textarea,
          properties: properties
      }
      }
}
),kapikey.klaviyoApipublicKey)
} catch (e) {
    console.log(e);
}
});

klaviyoQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

klaviyoQueue.on('error', (err) => {
  console.error('Queue error:', err);
});

//klaviyoQueue.add({ email: 'johndoe@example.com' });
export default klaviyoQueue;