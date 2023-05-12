import fetch from 'node-fetch';

async function verifyRecaptcha(token, secretKey) {
    const url = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await fetch(`${url}?secret=${secretKey}&response=${token}`, {
      method: 'POST'
    });
    const data = await response.json();
    return data;
  }

  
  export const verifytoken = async (req, res, next) => {
    let recaptchaEnabled = req.body.recaptchaEnabled;
    if(!recaptchaEnabled){
        console.log("No recaptcha Validation")
        next()
    }else{
        const token = req.body.recaptchaToken;
        const secretKey = '6LdB1MklAAAAAFnAbEReeYzfHp_-VJPgVlvuucxl';
        //6LdB1MklAAAAAOBDbbpgvHOyUFVDNh4nUGsjb-Q4
        if (!token) {
            return res.status(400).json({ error: 'Recaptcha token is missing' });
        }
        
        verifyRecaptcha(token, secretKey)
        .then(data => {
            if (data.success) {
                console.log("Recaptcha Validation Successfull")
                next()
            } else {
                return res.status(400).json({ error: 'Recaptcha verification failed' });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        });
    }
}
