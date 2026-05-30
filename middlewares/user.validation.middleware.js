import { USER } from "../models/user.js";

const createValidationError = () => {
  return new Error("User entity to create isn't valid");
};

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isGmail = (value) => {
  return typeof value === "string" && /^[^\s@]+@gmail\.com$/i.test(value);
};

const isPhone = (value) => {
  return typeof value === "string" && /^\+380\d{9}$/.test(value);
};

const isValidPassword = (value) => {
  return typeof value === "string" && value.length >= 3;
};

const createUserValid = (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;
  const userFields = Object.keys(USER);
  const allowedFields = userFields.filter((field) => field !== "id");
  const allowedFieldsSet = new Set(allowedFields);
  const bodyFields = Object.keys(req.body);

  const hasId = bodyFields.includes("id");
  const hasUnknownFields = bodyFields.some(
    (field) => !allowedFieldsSet.has(field)
  );
  const hasAllRequiredFields = allowedFields.every((field) =>
    bodyFields.includes(field)
  );

  const isValid =
    !hasId &&
    !hasUnknownFields &&
    hasAllRequiredFields &&
    isNonEmptyString(firstName) &&
    isNonEmptyString(lastName) &&
    isGmail(email) &&
    isPhone(phone) &&
    isValidPassword(password);

  if (!isValid) {
    res.err = createValidationError();
  }

  next();
};

const updateUserValid = (req, res, next) => {
  // TODO: Implement validatior for user entity during update
  next();
};

export { createUserValid, updateUserValid };
