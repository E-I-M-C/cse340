// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accValidate = require('../utilities/account-validation')


// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login attempt
router.post(
  "/login",
  accValidate.loginRules(),
  accValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process')
  }
)

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  accValidate.registationRules(),
  accValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;