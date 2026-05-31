import { FIGHTER } from "../models/fighter.js";

const createValidationError = () => {
  return new Error("Fighter entity to create isn't valid");
};

const updateValidationError = () => {
  return new Error("Fighter entity to update isn't valid");
};

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isNumberInRange = (value, min, max) => {
  return typeof value === "number" && value >= min && value <= max;
};

const createFighterValid = (req, res, next) => {
  const { name, power, defense, health } = req.body;
  const fighterFields = Object.keys(FIGHTER);
  const allowedFields = fighterFields.filter((field) => field !== "id");
  const requiredFields = allowedFields.filter((field) => field !== "health");
  const allowedFieldsSet = new Set(allowedFields);
  const bodyFields = Object.keys(req.body);

  const hasId = bodyFields.includes("id");
  const hasUnknownFields = bodyFields.some(
    (field) => !allowedFieldsSet.has(field)
  );
  const hasAllRequiredFields = requiredFields.every((field) =>
    bodyFields.includes(field)
  );
  const isHealthValid =
    health === undefined || isNumberInRange(health, 80, 120);

  const isValid =
    !hasId &&
    !hasUnknownFields &&
    hasAllRequiredFields &&
    isNonEmptyString(name) &&
    isNumberInRange(power, 1, 100) &&
    isNumberInRange(defense, 1, 10) &&
    isHealthValid;

  if (!isValid) {
    res.err = createValidationError();
  } else if (health === undefined) {
    req.body.health = FIGHTER.health;
  }

  next();
};

const updateFighterValid = (req, res, next) => {
  const { name, power, defense, health } = req.body;
  const fighterFields = Object.keys(FIGHTER);
  const allowedFields = fighterFields.filter((field) => field !== "id");
  const allowedFieldsSet = new Set(allowedFields);
  const bodyFields = Object.keys(req.body);

  const hasId = bodyFields.includes("id");
  const hasUnknownFields = bodyFields.some(
    (field) => !allowedFieldsSet.has(field)
  );
  const hasAtLeastOneField = bodyFields.some((field) =>
    allowedFieldsSet.has(field)
  );

  const isNameValid = name === undefined || isNonEmptyString(name);
  const isPowerValid = power === undefined || isNumberInRange(power, 1, 100);
  const isDefenseValid =
    defense === undefined || isNumberInRange(defense, 1, 10);
  const isHealthValid =
    health === undefined || isNumberInRange(health, 80, 120);

  const isValid =
    !hasId &&
    !hasUnknownFields &&
    hasAtLeastOneField &&
    isNameValid &&
    isPowerValid &&
    isDefenseValid &&
    isHealthValid;

  if (!isValid) {
    res.err = updateValidationError();
  }

  next();
};

export { createFighterValid, updateFighterValid };
