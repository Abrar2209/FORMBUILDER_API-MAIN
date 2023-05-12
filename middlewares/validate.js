import Joi from 'joi';
import validator from "validator";

const createformschema = Joi.object({
  id: Joi.string().guid({version: ['uuidv4']}),
  formtitle: Joi.string().min(3).max(20).required(),
  shopname: Joi.string().required(),
  shortcode: Joi.string().required(),
  componentJSON: Joi.array().items(Joi.object().required()).min(1).required(),
  headerJSON: Joi.object().required(),
  footerJSON: Joi.object().required(),
  afterSubmit: Joi.object().required(),
  formSettings: Joi.object().required(),
  status: Joi.boolean().default(true),
  formCSS: Joi.object(),
});

const updateformschema = Joi.object({
  formtitle: Joi.string().min(3).max(20),
  componentJSON: Joi.array().items(Joi.object().required()).min(1),
  headerJSON: Joi.object(),
  footerJSON: Joi.object(),
  afterSubmit: Joi.object(),
  status: Joi.boolean(),
  formSettings: Joi.object(),
  formCSS: Joi.object(),
});

const createSubmissionSchema = Joi.object({
  formtitle: Joi.string().min(3).max(20).required(),
  customerID: Joi.string().allow(''),
  customerIpAdd: Joi.string().ip().allow(''),
  pageUrl: Joi.string().uri().required(),
  fields: Joi.object().required(),
});


const validateUUID = (req, res, next) => {
  const {id} = req.query;
  req.id = id;
  if(!id){
    return res.status(400).json({ message: "Form uuid is required" });
  }else{
    if (!validator.isUUID(id, 4)) {
      return res.status(400).json({ message: "Invalid Form uuid." });
    }
  }
  next();
};

const validateBody = (req, res, next) => {
  const { error } = createformschema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateSubmissionBody = (req, res, next) => {
  const {recaptchaToken, recaptchaEnabled, adminMailSetings, shopname, ...data} = req.body;

  const { error } = createSubmissionSchema.validate(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUpdateBody = (req, res, next) => {
  const { error } = updateformschema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

export {validateBody,validateUpdateBody, validateUUID, validateSubmissionBody};