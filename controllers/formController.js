import db from "../index.js";
import moment from "moment";
const Form = db.forms;

// Create form
export const createForm = async (req, res) => {
  const {
    id,
    formtitle,
    shopname,
    shortcode,
    componentJSON,
    headerJSON,
    footerJSON,
    afterSubmit,
    formSettings,
    status,
    klaviyoIntegration,
    formCSS
  } = req.body;
  
  const info = {
    id,
    formtitle,
    shopname,
    shortcode,
    componentJSON,
    headerJSON,
    footerJSON,
    afterSubmit,
    formSettings,
    status,
    klaviyoIntegration,
    formCSS
  };

  const form = await Form.create(info);
  res.status(200).send(form);
};

// Get all forms
export const getForms = async (req, res) => {
  try {
    const forms = await Form.findAll();
    if (forms) {
      const formattedData = forms.map((form) => {
        const createdAt = moment(form.createdAt).format("DD MMM YYYY h:mm a");
        const updatedAt = moment(form.updatedAt).format("DD MMM YYYY h:mm a");
        return {
          ...form.dataValues,
          createdAt,
          updatedAt,
        };
      });
      res.status(200).json({
        forms: formattedData,
      });
    } else {
      res.status(400).json({
        forms: `Form table is empty!`,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get form by id
export const getForm = async (req, res) => {
  try {
    const form = await Form.findOne({
      where: {
        id: req.id,
      },
    });
    if (form) {
      const createdAt = moment(form.createdAt).format("DD MMM YYYY h:mm a");
      const updatedAt = moment(form.updatedAt).format("DD MMM YYYY h:mm a");
      const formattedData = { ...form.dataValues, createdAt, updatedAt };
      res.status(200).json({
        forms: formattedData,
      });
    } else {
      res.status(400).json({
        forms: `No form was found with the given ID: ${req.id}. Please provide a valid ID to fetch the form.`,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete Form
export const deleteForm = async (req, res) => {
  try {
    const form = await Form.findOne({
      where: {
        id: req.id,
      },
    });

    if (form) {
      await Form.destroy({ where: { id: req.id } });
      res.status(200).send("Form is deleted !");
    } else {
      res.status(400).json({
        forms: `No form was found with the given ID: ${req.id}. Please provide a valid ID to fetch the form.`,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// update form
export const updateform = async (req, res) => {
  const { formtitle, componentJSON, headerJSON, footerJSON, status, formCSS, afterSubmit, klaviyoIntegration, formSettings } = req.body;

  try {
    const form = await Form.findOne({
      where: {
        id: req.id,
      },
    });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const updates = {};
    if ("formtitle" in req.body) updates.formtitle = formtitle;
    if ("componentJSON" in req.body) updates.componentJSON = componentJSON;
    if ("headerJSON" in req.body) updates.headerJSON = headerJSON;
    if ("footerJSON" in req.body) updates.footerJSON = footerJSON;
    if ("status" in req.body) updates.status = status;
    if ("formCSS" in req.body) updates.formCSS = formCSS;
    if ("afterSubmit" in req.body) updates.afterSubmit = afterSubmit;
    if ("klaviyoIntegration" in req.body) updates.klaviyoIntegration = klaviyoIntegration;
    if ("formSettings" in req.body) updates.formSettings = formSettings;

    await form.update(updates);
    const createdAt = moment(form.createdAt).format("DD MMM YYYY h:mm a");
    const updatedAt = moment(form.updatedAt).format("DD MMM YYYY h:mm a");
    const formattedData = { ...form.dataValues, createdAt, updatedAt };
    res.status(200).send(formattedData);
  } catch (error) {
    res.status(400).send(error);
  }
};
