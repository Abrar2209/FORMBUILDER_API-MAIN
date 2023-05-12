import nodemailer from "nodemailer";
const mailConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'mahendra@digitalrangers.in',
    pass: 'lnqdlapblvybjwyi',
  },
};

export const sendMailWithGoogle = (data) => {
  const { email, emailSubject, emailContent } = data
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: "ReactFormBuilder <vaibhav@digitalrangers.in>",
      to: email,
      subject: emailSubject,
      html: emailContent,
    };
    
    nodemailer
      .createTransport(mailConfig)
      .sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);  
        } else {
          resolve(info);
        }
      });
  });
}
