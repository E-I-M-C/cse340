// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accountValidate = require('../utilities/account-validation')


// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login attempt
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Route to build account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

// Route to build account edit view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.editAccountView)
)

// Process the updated account data
router.post("/update/info", utilities.handleErrors(accountController.updateAccount))

// Process the changed password
router.post("/update/password", utilities.handleErrors(accountController.changePassword))

// Route to build account logout view
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router;