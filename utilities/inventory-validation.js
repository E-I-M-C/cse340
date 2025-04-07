const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Add Classification Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
  return [
    // valid classification is required and cannot already exist in the database
    body("classification_name")
      .trim()
      .isAlpha() // refer to validator.js docs
      .withMessage("A valid classification is required.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please use a different classification name.")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to managment
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let account = utilities.buildAccountButton(res)
    res.render("./inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
      account,
    })
    return
  }
  next()
}

/*  **********************************
  *  Add Inventory Validation Rules
  * ********************************* */
validate.addInventoryRules = () => {
  return [
    // valid classification is required
    body("classification_id")
      .notEmpty()
      .withMessage("The vehicle's classification is required."),
  
    // valid make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("The vehicle's maker is required."),

    // valid model is required
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("The vehicle's model is required."),

    // valid year is required
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage("A valid year is required."),

    // vaild description is required
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("The vehicle's description is required."),

    // valid image path is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("A valid image path is required."),

    // valid thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("A valid thumbnail path is required."),

    // valid price is required
    body("inv_price")
      .trim()
      .notEmpty()
      .isCurrency({ allow_negatives: false, thousands_separator: "" })
      .withMessage("The vehicle's price is required."),

    // valid miles are required
    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("The vehicle's miles are required."),

    // valid color required
    body("inv_color")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("The vehicle's color is required."),
  ]
}

/* ******************************
 * Check data and return errors or continue to managment
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    let account = utilities.buildAccountButton(res)
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      account,
    })
    return
  }
  next()
}

/*  **********************************
  *  Add Inventory Validation Rules
  * ********************************* */
validate.newInventoryRules = () => {
  return [
    // valid id required
    body("inv_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("The vehicle's id is required."),

    // valid classification is required
    body("classification_id")
      .notEmpty()
      .withMessage("The vehicle's classification is required."),
  
    // valid make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("The vehicle's maker is required."),

    // valid model is required
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("The vehicle's model is required."),

    // valid year is required
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage("A valid year is required."),

    // vaild description is required
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("The vehicle's description is required."),

    // valid image path is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("A valid image path is required."),

    // valid thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("A valid thumbnail path is required."),

    // valid price is required
    body("inv_price")
      .trim()
      .notEmpty()
      .isCurrency({ allow_negatives: false, thousands_separator: "" })
      .withMessage("The vehicle's price is required."),

    // valid miles are required
    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("The vehicle's miles are required."),

    // valid color required
    body("inv_color")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("The vehicle's color is required."),
  ]
}

/* ******************************
 * Check data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    let account = utilities.buildAccountButton(res)
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id,
      account,
    })
    return
  }
  next()
}

module.exports = validate