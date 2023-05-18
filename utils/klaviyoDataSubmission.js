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
      console.log(klaviyoData.defaultOption);
      const properties = {};
      
      Object.values(klaviyoData.klaviyoListMapping).forEach(mapping => {
        const formFieldId = mapping.form_field;
        const klaviyoField = mapping.klaviyo_field;
        console.log("formFieldId",formFieldId);
        console.log(klaviyoField);
        console.log(job.data.fields.hasOwnProperty(formFieldId))

         if (mapping.is_fixed && mapping.is_input !== "") {
        // Field has a fixed value, assign it directly
        properties[klaviyoField] = mapping.is_input;
      } else {
        // Field does not have a fixed value, retrieve from form fields
        if (fieldIds.includes(formFieldId)) {
          const formFieldValue = job.data.fields[formFieldId];
          if (klaviyoField === "email") {
            // If the klaviyoField is 'email', store the value in properties and use it as the email
            properties[klaviyoField] = formFieldValue;
          } else {
            // For other fields, store their values normally
            properties[klaviyoField] = formFieldValue;
          }
        }
      }
      // if (key.startsWith("custom-")) {
      //   const customFieldKey = key.split("-")[1];
      //   const customFormFieldId = mapping.form_field;
      //   if (fieldIds.includes(customFormFieldId)) {
      //     const customFormFieldValue = job.data.fields[customFormFieldId];
      //     properties[customFieldKey] = customFormFieldValue;
      //   }
      // }
        //if (formFieldId && klaviyoField && job.data.fields.hasOwnProperty(formFieldId)) {
          // const formFieldValue = job.data.fields[formFieldId];
          // //console.log(formFieldValue);
          // properties[klaviyoField] = formFieldValue;
        //}
      });
  
      console.log("IDS: " + formid);
        console.log(properties);
    
      await Client.createClientSubscription(JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            list_id: klaviyoData.defaultOption,
            custom_source: 'Client Subscription',
            email: properties.email ,
            properties: properties
          }
        }
      }), kapikey.klaviyoApipublicKey);
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