const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.
  
    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let account = utilities.buildAccountButton(res)
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account,
    })
    return
  }
  next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists){
          throw new Error("Email does not exists. Please use different email")
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let account = utilities.buildAccountButton(res)
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
      account
    })
    return
  }
  next()
}

/*  **********************************
  *  Change Account Data Validation Rules
  * ********************************* */
validate.infoRules = (req, res) => {
  return [
    // id is required
    body("account_id")
      .trim()
      .notEmpty(),

    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.
  
    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to account
 * ***************************** */
validate.checkInfoData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty() || account_id != res.locals.accountData.account_id) {
    let nav = await utilities.getNav()
    let account = utilities.buildAccountButton(res)
    res.render("account/update-account", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account,
    })
    return
  }
  next()
}

/*  **********************************
  *  Change Password Validation Rules
  * ********************************* */
validate.passwordRules = (req, res) => {
  return [
    // id is required
    body("account_id")
      .trim()
      .notEmpty(),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to account
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty() || account_id != res.locals.accountData.account_id) {
    let nav = await utilities.getNav()
    let account = utilities.buildAccountButton(res)
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update-account", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to home
 * ***************************** */
validate.checkAccountDeleteData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty() || account_id != res.locals.accountData.account_id) {
    let nav = await utilities.getNav()
    let account = utilities.buildAccountButton(res)
    res.render("account/delete-account", {
      errors,
      title: "Delete Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account,
    })
    return
  }
  next()
}

module.exports = validate