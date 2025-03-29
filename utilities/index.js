const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the item view HTML
* ************************************ */
Util.buildItemView = async function(data){
  const details = data[0]
  return `<div id="details-img">
    <img src="${details.inv_image}" alt="Image of ${details.inv_make} ${details.inv_model} on CSE Motors"/>
  </div>
  <section id="details">
    <h3>${details.inv_make} ${details.inv_model} Details</h3>
    <ul>
      <li><span>Price:</span> <span id="price">$${new Intl.NumberFormat('en-US').format(details.inv_price)}</span></li>
      <li><span>Description:</span> ${details.inv_description}</li>
      <li><span>Color:</span> ${details.inv_color}</li>
      <li><span>Miles:</span> ${new Intl.NumberFormat('en-US').format(details.inv_miles)}</li>
    </ul>
  </section>`
}

/*  **********************************
  *  Add Classification Validation Rules
  * ********************************* */
Util.addClassificationRules = () => {
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
Util.checkAddClassification = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
 * Constructs the select HTML
 * ***************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/*  **********************************
  *  Add Inventory Validation Rules
  * ********************************* */
Util.addInventoryRules = () => {
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
Util.checkAddInventory = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    const select = await Util.buildClassificationList(classification_id)
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      select,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util