import Queue from 'bull';
import Klaviyo from 'klaviyo-node';
import {id} from '../server.js';
import {Client} from 'klaviyo-api';
import {connection } from '../controllers/appSettingsController.js'
let klaviyoKeys={};
connection.promise().execute(`SELECT klaviyoIntegration FROM forms where formtitle='demo'`)
  .then(([rows, fields]) => {
    rows.forEach(row => {
      const klaviyoData = JSON.parse(row.klaviyoIntegration);
      console.log(klaviyoData.klaviyoListMapping)
      klaviyoKeys = Object.keys(klaviyoData.klaviyoListMapping);
      console.log(klaviyoKeys);
    });
  })
  .catch(error => {
    console.log(error);
  });
const klaviyo = new Klaviyo({
    apiKey:'pk_d033081e07671da0493b729a08b01619d9'
  });

const klaviyoQueue = new Queue('klaviyo');

klaviyoQueue.process(async (job) => {
  console.log(job.data.fields)
  const values=Object.values(job.data.fields)
    let properties= {};
    for(var i = 0;i<klaviyoKeys.length;i++){
      console.log(klaviyoKeys[i]+""+values[i])
      properties[klaviyoKeys[i]] = values[i];
      // klaviyoFields=klaviyoKeys[i];
    }
  try {
    console.log("IDS"+id)
    console.log(properties);
    
    // console.log(klaviyoFields)
   
    Client.createClientSubscription( JSON.stringify(
      {
        data:{
        type: "subscription",
        attributes: {
        list_id: id ,
        custom_source:'Client Subscription',
          email: job.data.fields.Text,
          phone_number: job.data.fields.Textarea,
          properties: properties
      }
      }
}
),'Yqna8d')
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