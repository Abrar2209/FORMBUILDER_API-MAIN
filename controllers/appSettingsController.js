import mysql from "mysql2";

export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "formdb",
});

// Check if connection has been established successfully
connection.connect(function (err) {
  if (err) {
    console.error("Error connecting: " + err);
    return;
  }
  console.log("Connected");
});

export const smtpSetting = (req, res) => {
    const { smtpSetting, shop } = req.body;
    
  var sql = `UPDATE shopify_sessions SET smtpSetting = ? WHERE shop = ?`;
  connection.query(sql, [JSON.stringify(smtpSetting), shop], function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log("Row has been updated");
      res.status(201).send({
        "Data Stored!": result,
      });
    }
  });
};

export const recaptchaSetting = (req, res) => {
  const { recaptchaSetting, shop } = req.body;
  var sql = `UPDATE shopify_sessions SET recaptchaSetting = ? WHERE shop = ?`;
  connection.query(sql, [JSON.stringify(recaptchaSetting), shop], function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log("Row has been updated");
      res.status(201).send({
        "Data Stored!": result,
      });
    }
  });
};
let globalId = null;

export const getGlobalId = () => {
  return globalId;
};
export const klaviyoSetting = (req, res) => {
  const { klaviyoSetting, shop,id } = req.body;
  console.log(req.body)
  
  var sql = `UPDATE shopify_sessions SET klaviyoSetting = ? WHERE shop = ?`;
  connection.query(sql, [JSON.stringify(klaviyoSetting), shop], function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log("Row has been updated");
      globalId = id; 
      res.status(201).send({
        "Data Stored!": result,
      });
    }
  });
};

export const getShopifySession = (req, res) => {
    const shop = req.query.shop;
  
    const sql = `SELECT smtpSetting, recaptchaSetting, klaviyoSetting FROM shopify_sessions WHERE shop = ?`;
  
    connection.query(sql, [shop], function (err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  };