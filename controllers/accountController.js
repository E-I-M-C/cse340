const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  let account = utilities.buildAccountButton(res)
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  let account = utilities.buildAccountButton(res)
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  let account = utilities.buildAccountButton(res)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      account,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  let account = utilities.buildAccountButton(res)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      account,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        account,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_id } = res.locals.accountData
  let account = utilities.buildAccountButton(res)
  let management = buildManagementButton(res)
  res.render("account/account", {
    title: "Account",
    nav,
    account_firstname,
    account_id,
    errors: null,
    account,
    management
  })
}

function buildManagementButton(res) {
  if (res.locals.accountData.account_type.toLowerCase() == "admin" || res.locals.accountData.account_type.toLowerCase() == "employee") {
    return `<h3 class="management">Inventory Management</h3>
      <a href="/inv">Manage Inventory</a>`
  }
}

/* ****************************************
*  Deliver edit account view
* *************************************** */
async function editAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  if (account_id !== res.locals.accountData.account_id) {
    req.flash("notice", `You are not permitted on that page.`)
    res.redirect("/account")
  }
  let nav = await utilities.getNav()
  let account = utilities.buildAccountButton(res)
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account,
    account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  let account = utilities.buildAccountButton(res)
  const {account_id, account_firstname, account_lastname, account_email} = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("kudos", `Congratulations, your information has been updated.`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, your information failed to update.")
    console.log(account_id)
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account
    })
  }
}

/* ****************************************
*  Process Change Password
* *************************************** */
async function changePassword(req, res) {
  const { account_password } = req.body
  const { account_id } = res.locals.accountData

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    res.redirect(`/account/update/${account_id}`)
  }

  const changeResult = await accountModel.changePassword(account_id, hashedPassword)

  if (changeResult) {
    req.flash("kudos", "Congratulations, your password has been changed.")
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, your password change failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

/* ***************************
 *  Logout Account
 * ************************** */
async function accountLogout(req, res, next) {
  try {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 0 })
    return res.redirect("/")
  } catch (error) {
    req.flash("notice", "Couldn't log out.")
    return res.redirect("/account")
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, editAccountView, updateAccount, changePassword, accountLogout }