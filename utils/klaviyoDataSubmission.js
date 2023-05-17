import Queue from 'bull';
import Klaviyo from 'klaviyo-node';
import {id} from '../server.js';
import {Client} from 'klaviyo-api';
import {connection } from '../controllers/appSettingsController.js';
import { kapikey,formid } from '../server.js';

let klaviyoKeys=[];

const klaviyo = new Klaviyo({
    apiKey:'pk_d033081e07671da0493b729a08b01619d9'
  });
  
const klaviyoQueue = new Queue('klaviyo');

klaviyoQueue.process(async (job) => {
  console.log("Forms id:"+formid)
  console.log(job.data.fields)
  const fieldIds = Object.keys(job.data.fields);
  console.log(fieldIds);

  try {
    const [rows, fields] = await connection.promise().execute(`SELECT klaviyoIntegration FROM forms WHERE id=?`, [formid]);
  
    rows.forEach(async row => {
      const klaviyoData = JSON.parse(row.klaviyoIntegration);
      console.log(klaviyoData.klaviyoListMapping);
  
      const properties = {};
      
      Object.values(klaviyoData.klaviyoListMapping).slice(1).forEach(mapping => {
        const formFieldId = mapping.form_field;
        const klaviyoField = mapping.klaviyo_field;
        console.log("formFieldId",formFieldId);
        console.log(klaviyoField);
        console.log(job.data.fields.hasOwnProperty(formFieldId))
        if (fieldIds.includes(formFieldId)) {
          const formFieldValue = job.data.fields[formFieldId];
          properties[klaviyoField] = formFieldValue;
        }
        
        //if (formFieldId && klaviyoField && job.data.fields.hasOwnProperty(formFieldId)) {
          // const formFieldValue = job.data.fields[formFieldId];
          // //console.log(formFieldValue);
          // properties[klaviyoField] = formFieldValue;
        //}
      });
  
      console.log("IDS: " + formid);
      console.log(properties);
  
      // await Client.createClientSubscription(JSON.stringify({
      //   data: {
      //     type: "subscription",
      //     attributes: {
      //       list_id: "WFTi2P",
      //       custom_source: 'Client Subscription',
      //       email: job.data.fields.Text,
      //       properties: properties
      //     }
      //   }
      // }), kapikey.klaviyoApipublicKey);
    });
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