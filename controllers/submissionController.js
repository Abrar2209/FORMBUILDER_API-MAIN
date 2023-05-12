import db from "../index.js";
const Submission = db.submissions;
import moment from 'moment';
import {id} from '../server.js';
import {Profiles} from 'klaviyo-api';
import sendMailQueue from "../utils/mailJobScheduler.js";
import {connection} from '../controllers/appSettingsController.js'
import klaviyoQueue from "../utils/klaviyoDataSubmission.js";
import mysql from 'mysql2/promise'

export let shopnames="";
// Create submission
export const createSubmission = async (req, res) => {
  const {recaptchaToken, recaptchaEnabled, adminMailSetings, shopname, ...data} = req.body;
    //const {...emailData} = adminMailSetings;
    //emailData.shopname = shopname;
     console.log(shopname)
     shopnames=shopname
    // if(data.customerIpAdd || data.customerID){
    //   const sql = `SELECT klaviyoSetting FROM shopify_sessions WHERE shop = ?`;
    // connection.query(sql, [shopname], function (err, result) {
    //     const jsonObject = JSON.parse(result[0].klaviyoSetting);
    //     klaviyoApiKey = jsonObject.klaviyoApiKey;
    //   });
     // emailData.jsonData = result;
      //if(enable){
        //console.log("Id"+id);
       await klaviyoQueue.add(data);
        //await sendMailQueue.add(emailData);
      //}
    // }else{
    //   res.status(400).send("IpAdd or customer id, one of is required!");
    // }
  };



export const getSubmissions = async (req, res) => {
  try {
    const formtitle = req.params.formtitle;
    const data = await Submission.findAll({
      where: {
        formTitle: formtitle,
      },
    });
    if (data.length > 0) {
      const formattedData = data.map((submission) => {
      const createdAt = moment(submission.createdAt).format('DD MMM YYYY h:mm a');
      const updatedAt = moment(submission.updatedAt).format('DD MMM YYYY h:mm a');
        return {
          ...submission.dataValues,
          createdAt, updatedAt
        };
      });
      res.status(200).json({
        data: formattedData,
      });
    } else {
      res.status(400).json({
        data: `No submissions found for form title ${formtitle}!`,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
