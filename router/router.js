import { createForm, getForms, getForm, deleteForm, updateform } from '../controllers/formController.js';
import { createSubmission, getSubmissions } from '../controllers/submissionController.js';
import { recaptchaSetting, smtpSetting, klaviyoSetting, getShopifySession } from '../controllers/appSettingsController.js';
import {validateBody, validateUpdateBody, validateUUID, validateSubmissionBody} from '../middlewares/validate.js';
import { verifytoken } from '../middlewares/verifyRecaptcha.js';
// router
import { Router } from 'express';
const router = Router();


// form routers
router.post('/createform', validateBody, createForm);
router.get('/getforms', getForms);
router.get('/getform', validateUUID, getForm);
router.delete('/deleteForm', validateUUID, deleteForm);
router.put('/updateform', validateUUID, validateUpdateBody, updateform);

// submission routers
router.post('/submit', validateSubmissionBody, verifytoken, createSubmission);
router.get('/getSubmissions/:formtitle', getSubmissions);

// appSettings Router
router.post('/updateSmtpSettings', smtpSetting);
router.post('/updateRecaptchaSettings', recaptchaSetting);
router.post('/updateKlaviyoSettings', klaviyoSetting);
router.get('/getShopifySession', getShopifySession);

export default router;
