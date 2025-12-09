const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const mysql = require("mysql2");
const { check, validationResult } = require("express-validator");
let BookingForm = validateBooking();
let ContactForm = validateContact();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
  port: 3306,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../HTML"))); 
app.use('/CSS', express.static(path.join(__dirname, '../CSS')));
app.use('/JS', express.static(path.join(__dirname, '../JS')));
app.use('/MEDIA', express.static(path.join(__dirname, '../MEDIA')));

app.post("/insertBooking", BookingForm, (req, res) => {
  const errors = validationResult(req);
  let msg = "";

  if (!errors.isEmpty()) {
    msg = "<h1>Sorry, we found validation errors with your submission</h1>" +
          printErrors(errors.array()) +
          "<h2><a href='booking.html'>Click here</a> to return</h2>";
    res.send(msg);

  } else {
    const data = {
      fullname: req.body.fullname,
      mobile: req.body.mobile,
      dob: req.body.dob,
      email: req.body.email,
      campaign_selection: req.body.campaign_selection,
      trip_type: req.body.trip_type,
      guide_language: req.body.guide_language,
      special_requests: req.body.special_requests
    };
    
    pool.query("INSERT INTO booking SET ?", data, (err, result) => {
    if (err) {
        console.log("SQL Error (Booking):", err); // هنا سنلتقط الخطأ
        return res.send("<h1>Database error occurred while saving your booking.</h1>");
    }
    const successMsg = "<h1>Thank you, your booking has been saved.</h1><h2><a href='booking.html'>Make another booking</a></h2>";
    res.send(successMsg);
});}});


app.post("/insertContact", ContactForm, (req, res) => {
  const errors = validationResult(req);
  let msg = "";

  if (!errors.isEmpty()) {
    msg = "<h1>Sorry, we found validation errors with your submission</h1>" +
          printErrors(errors.array()) +
          "<h2><a href='contactUS.html'>Click here</a> to return</h2>";
    res.send(msg);
  } else {
    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      mobile: req.body.mobile,
      email: req.body.email,
      language: req.body.language,
      message: req.body.message,
      dob: req.body.dob,
      gender: req.body.gender
    };

    pool.query("INSERT INTO contact SET ?", data, (err, result) => {
        if (err) {
            console.log("SQL Error:", err);
            return res.send("<h1>Database error occurred</h1>");
        }
        const msg="<h1>Thank you, your message has been saved.</h1><h2><a href='contactUS.html'>Send another message</a></h2>";
        res.send(msg);
    });
  }
});

app.get("/viewBooking", (req, res) => {
  const query = "SELECT * FROM booking";
  pool.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function validateBooking() {
  return [
    check("fullname")
      .notEmpty().withMessage("Full Name is missing")
      .isLength({ min: 2 , max: 30 }).withMessage("Full Name must be at least 2 characters")
      .matches("[A-Za-z ]+").withMessage("Full Name must contain letters only")
      .trim()
      .escape(),

    check("mobile")
      .notEmpty().withMessage("Mobile is required")
      .isNumeric().withMessage("Mobile must contain numbers only")
      .isLength({ min: 10, max: 10 }).withMessage("Mobile must be 10 digits")
      .trim()
      .escape(),

    check("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Email format is wrong")
      .trim()
      .escape(),

    check("dob")
      .notEmpty().withMessage("Date of Birth is required")
      .isDate().withMessage("Date must be valid"),

    check("campaign_selection")
      .notEmpty().withMessage("Please select a campaign")
      .trim()
      .escape(),

    check("trip_type")
      .notEmpty().withMessage("Trip type is required"),

    check("guide_language")
      .notEmpty().withMessage("Guide language is required")
      .isLength({ max: 30 }).withMessage("Guide language too long")
      .trim()
      .escape(),

    check("special_requests")
      .optional()
      .isLength({ max: 255 }).withMessage("Special requests too long")
      .trim()
      .escape()
  ];
}

function validateContact() {
  return [
    check("first_name")
      .notEmpty().withMessage("First Name is missing")
      .isLength({ min: 2 }).withMessage("First Name must be at least 2 letters")
      .isString().withMessage("First Name must be string")
      .matches("[A-Za-z]+").withMessage("First name must contain letters only")
      .trim()
      .escape(),

    check("last_name")
      .notEmpty().withMessage("Last Name is missing")
      .isLength({ min: 2 }).withMessage("Last Name must be at least 2 letters")
      .isString().withMessage("Last Name must be string")
      .matches("[A-Za-z]+").withMessage("Last name must contain letters only")
      .trim()
      .escape(),

    check("mobile")
      .notEmpty().withMessage("Mobile is required")
      .isNumeric().withMessage("Mobile must contain numbers only")
      .isLength({ min: 10, max: 10 }).withMessage("Mobile must be 10 digits")
      .trim()
      .escape(),

    check("email")
      .notEmpty().withMessage("Email is missing")
      .isEmail().withMessage("Email format is wrong")
      .trim()
      .escape(),
      
    check("language")
      .notEmpty().withMessage("language is required"),

    check("message")
      .notEmpty().withMessage("Message is missing")
      .isLength({ min: 5 }).withMessage("Message is too short")
      .trim()
      .escape(),

    check("dob")
    .notEmpty().withMessage("Date of Birth is required")
    .isDate().withMessage("Date must be valid"),

    check("gender")
    .notEmpty().withMessage("Gender is required")

  ];
}

function printErrors(errorsArray) {
    var result = "";
    for (var i = 0; i < errorsArray.length; i++) {
        result += "<p>" + errorsArray[i].msg + "</p>";
    }
    return result;
}
