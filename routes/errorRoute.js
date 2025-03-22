// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")


// Route to build inventory by classification view
router.get("/", utilities.handleErrors(errorController.runError));

module.exports = router;