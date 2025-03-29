// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build item by invetory view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Process the added classification data
router.post(
  "/add-classification",
  utilities.addClassificationRules(),
  utilities.checkAddClassification,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add-vehicle", utilities.handleErrors(invController.buildAddInventory))

// Process the added inventory data
router.post(
  "/add-vehicle",
  utilities.addInventoryRules(),
  utilities.checkAddInventory,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;