const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build details by item view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getItemByInventoryId(inv_id)
  const details = await utilities.buildItemView(data)
  let nav = await utilities.getNav()
  const itemYear = data[0].inv_year
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/item", {
    title: `${itemYear} ${itemName}`,
    nav,
    details,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Managment",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()

  if (addResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Managment",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the classification was not added.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const select = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    select,
    errors: null,
  })
}

/* ****************************************
*  Process inventory item
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  let nav = await utilities.getNav()

  if (addResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Managment",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the vehicle was not added.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
    })
  }
}

module.exports = invCont