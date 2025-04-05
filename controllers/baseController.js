const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const account = utilities.buildAccountButton(res)
  res.render("index", {title: "Home", nav, account})
}

module.exports = baseController