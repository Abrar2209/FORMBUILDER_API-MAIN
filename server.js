import express from 'express';
import cors from 'cors';
import router from './router/router.js';
import {ConfigWrapper, Lists} from 'klaviyo-api'
import fetch from 'node-fetch';
import {connection} from './controllers/appSettingsController.js'
export let kapikey="";
connection.query('SELECT klaviyoSetting FROM shopify_sessions ', (error, results) => {
  if (error) {
    console.error(error);
    //connection.end(); // close the connection
    return;
  }
  // extract the Klaviyo API key from the first row of the result set
  const { klaviyoApiKey } = JSON.parse(results[0].klaviyoSetting);

  console.log("Api Key"+klaviyoApiKey);
  kapikey=klaviyoApiKey
  //connection.end(); // close the connection

console.log("Keys"+kapikey)
 ConfigWrapper(kapikey)
})
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routers
app.use('/api/forms', router);

app.get('/', (req, res) => {
  res.status(200).send('Server is running fine');
});
app.get("/api/klaviyo/lists", async (req, res) => {
  Lists.getLists()
  .then((json) =>{
    res.status(200).send(json.body.data);
    console.log(json.body.data)
 })
.catch(error => console.log('An error was thrown check the HTTP code with error.status'));
}); 

export let id={};
app.post("/api/klaviyo/list/subscribe", (req, res) => {
  id =Object.keys(req.body)[0];
  console.log(id);

//   const url = `https://a.klaviyo.com/api/v2/list/${id}/subscribe?api_key=pk_e643e222ea5eeea1a8a774c1f5b3207fd7`;
//   const options = {
//     method: 'POST',
//     headers: {accept: 'application/json', 'content-type': 'application/json'},
//     body: JSON.stringify({
//       profiles: 
//         {
//           email: 'donesss.washington@klaviyo.com',
//         phone_number: '+13239169023', 
//         sms_consent: true
//       }
//     })
//   };
  
//   fetch(url, options)
//     .then(res => res.json())
//     .then(json => console.log(json))
//     .catch(err => console.error('error:' + err));
 });
//port
const PORT = process.env.PORT || 8080;

//server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
