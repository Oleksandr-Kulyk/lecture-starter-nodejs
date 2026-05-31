import { FIGHT } from "../models/fight.js";

const createValidationError = () => {
  return new Error("Fight entity to create isn't valid");
};

const updateValidationError = () => {
  return new Error("Fight entity to update isn't valid");
};

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isFightLog = (value) => {
  return Array.isArray(value);
};

const createFightValid = (req, res, next) => {
  const { fighter1, fighter2, log } = req.body;
  const fightFields = Object.keys(FIGHT);
  const allowedFields = fightFields.filter((field) => field !== "id");
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
    isNonEmptyString(fighter1) &&
    isNonEmptyString(fighter2) &&
    fighter1 !== fighter2 &&
    isFightLog(log);

  if (!isValid) {
    res.err = createValidationError();
  }

  next();
};

const updateFightValid = (req, res, next) => {
  const { fighter1, fighter2, log } = req.body;
  const fightFields = Object.keys(FIGHT);
  const allowedFields = fightFields.filter((field) => field !== "id");
  const allowedFieldsSet = new Set(allowedFields);
  const bodyFields = Object.keys(req.body);

  const hasId = bodyFields.includes("id");
  const hasUnknownFields = bodyFields.some(
    (field) => !allowedFieldsSet.has(field)
  );
  const hasAtLeastOneField = bodyFields.some((field) =>
    allowedFieldsSet.has(field)
  );

  const isFighter1Valid =
    fighter1 === undefined || isNonEmptyString(fighter1);
  const isFighter2Valid =
    fighter2 === undefined || isNonEmptyString(fighter2);
  const isFightersPairValid =
    fighter1 === undefined ||
    fighter2 === undefined ||
    fighter1 !== fighter2;
  const isLogValid = log === undefined || isFightLog(log);

  const isValid =
    !hasId &&
    !hasUnknownFields &&
    hasAtLeastOneField &&
    isFighter1Valid &&
    isFighter2Valid &&
    isFightersPairValid &&
    isLogValid;

  if (!isValid) {
    res.err = updateValidationError();
  }

  next();
};

export { createFightValid, updateFightValid };
