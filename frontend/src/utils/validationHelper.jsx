import Joi from "joi-browser";

const GenerateSchema = (field, caption, type, required) => {
  return { field, caption, type, required };
};

const GenerateSchemaModel = (inputList) => {
  let formModel = {};
  inputList.forEach((input) => {
    const { field, caption, type, required } = input;
    switch (type.toString().toUpperCase()) {
      case "TEXT":
        if (required)
          formModel[field] = Joi.string()
            .required()
            .error(() => {
              return {
                message: `${caption} is required.`,
              };
            });
        break;
      case "EMAIL":
        if (required) {
          formModel[field] = Joi.string()
            .required()
            .regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
            .error((errors) => {
              errors.forEach((err) => {
                switch (err.type) {
                  case "any.empty":
                    err.message = `${caption} is required.`;
                    break;
                  case "string.regex.base":
                    err.message = "Not a vaild Email";
                    break;
                  default:
                    err.message = `${caption} is required.`;
                    break;
                }
              });
              return errors;
            });
        } else {
          formModel[field] = Joi.string()
            .optional()
            .allow(null, "")
            .regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
            .error(() => {
              return {
                message: "Not a vaild Email.",
              };
            });
        }
        break;
      case "BOOLEAN":
        formModel[field] = Joi.boolean().required();
        break;
      case "NUMBER":
        if (required)
          formModel[field] = Joi.number()
            .required()
            .error(() => {
              return {
                message: `${caption} is required.`,
              };
            });
        break;
      case "DATE":
        if (required)
          formModel[field] = Joi.date()
            .required()
            .error(() => {
              return { message: `${caption} is required.` };
            });
        else
          formModel[field] = Joi.date()
            .optional()
            .allow(null, "")
            .error(() => {
              return { message: "Invalid Date Format." };
            });
        break;
      case "ARRAY":
        if (required)
          formModel[field] = Joi.array()
            .required()
            .error(() => {
              return { message: `${caption} is required.` };
            });
        break;
      default:
        break;
    }
  });
  return formModel;
};

const ValidateInput = (schema, value, field) => {
  let error = null;
  let errorMessage = "";
  if (schema.hasOwnProperty(field)) {
    error = Joi.validate(value, schema[field]);
  }
  if (error != null && error.error != null) {
    errorMessage = error.error.details[0].message;
  }
  return errorMessage;
};

const FormValidation = (schema, model) => {
  let isValidForm = true;
  let formModelSchema = { ...schema };
  const fieldsToValidate = Object.keys(formModelSchema);
  let formValidationErrors = {};
  for (var key in fieldsToValidate) {
    let fieldName = fieldsToValidate[key];
    let message = ValidateInput(formModelSchema, model[fieldName], fieldName);
    if (message) {
      isValidForm = false;
      formValidationErrors[fieldName] = message;
    } else {
      formValidationErrors[fieldName] = "";
    }
  }
  return { formValidationErrors, isValidForm };
};

const ValidationTool = {
  GenerateSchema,
  GenerateSchemaModel,
  ValidateInput,
  FormValidation,
};

export default ValidationTool;
