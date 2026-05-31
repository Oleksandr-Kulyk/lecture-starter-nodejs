import { Router } from "express";
import { fightService } from "../services/fightService.js";
import {
  createFightValid,
  updateFightValid,
} from "../middlewares/fight.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    try {
      res.data = fightService.getAll();
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.get(
  "/:id",
  (req, res, next) => {
    try {
      const fight = fightService.getById(req.params.id);

      if (!fight) {
        const err = new Error("Fight not found");
        err.status = 404;
        throw err;
      }

      res.data = fight;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.post(
  "/",
  createFightValid,
  (req, res, next) => {
    try {
      if (res.err) {
        return next();
      }

      res.data = fightService.create(req.body);
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.patch(
  "/:id",
  updateFightValid,
  (req, res, next) => {
    try {
      if (res.err) {
        return next();
      }

      const fight = fightService.update(req.params.id, req.body);

      if (!fight) {
        const err = new Error("Fight not found");
        err.status = 404;
        throw err;
      }

      res.data = fight;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.delete(
  "/:id",
  (req, res, next) => {
    try {
      const fight = fightService.delete(req.params.id);

      if (!fight) {
        const err = new Error("Fight not found");
        err.status = 404;
        throw err;
      }

      res.data = fight;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
