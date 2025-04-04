// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build item by invetory view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.managementView)
)

// Route to build add classification view
router.get("/newClassification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.newClassificationView)
)

// Process the added classification data
router.post(
  "/newClassification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/newVehicle",
  utilities.checkAccountType,
  utilities.handleErrors(invController.newVehicleView)
)

// Process the added inventory data
router.post(
  "/newVehicle",
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Return a json object if accessed
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit view
router.get("/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editView)
)

// Process the edited inventory data
router.post(
  "/update",
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete view
router.get("/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteView)
)

// Delete inventory item
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteItem)
)

module.exports = router;