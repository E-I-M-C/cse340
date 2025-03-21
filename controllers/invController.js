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

module.exports = invCont