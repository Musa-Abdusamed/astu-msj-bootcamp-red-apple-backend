const { body } = require("express-validator");

const applicationValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required."),

  body("telegramHandle")
    .trim()
    .notEmpty()
    .withMessage("Telegram username is required."),

  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required.")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be either Male or Female."),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required."),

  body("year")
    .trim()
    .notEmpty()
    .withMessage("Year is required."),

  body("university")
    .trim()
    .notEmpty()
    .withMessage("University or college is required."),

  body("githubUrl")
    .trim()
    .notEmpty()
    .withMessage("GitHub username or profile URL is required."),

  body("codeforcesUrl")
    .trim()
    .notEmpty()
    .withMessage("Codeforces username or profile URL is required."),

  body("leetcodeUrl")
    .trim()
    .notEmpty()
    .withMessage("LeetCode username or profile URL is required."),

  body("motivation")
    .trim()
    .notEmpty()
    .withMessage("Motivation is required.")
    .isLength({ min: 20 })
    .withMessage("Motivation must contain at least 20 characters."),

  body("roleAtApplication")
    .isIn(["student", "mentor"])
    .withMessage("Application role must be either student or mentor."),
];

module.exports = {
  applicationValidation,
};