import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    try {
      res.data = fighterService.getAll();
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
      const fighter = fighterService.getById(req.params.id);

      if (!fighter) {
        const err = new Error("Fighter not found");
        err.status = 404;
        throw err;
      }

      res.data = fighter;
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
  createFighterValid,
  (req, res, next) => {
    try {
      res.data = fighterService.create(req.body);
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
  updateFighterValid,
  (req, res, next) => {
    try {
      const fighter = fighterService.update(req.params.id, req.body);

      if (!fighter) {
        const err = new Error("Fighter not found");
        err.status = 404;
        throw err;
      }

      res.data = fighter;
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
      const fighter = fighterService.delete(req.params.id);

      if (!fighter) {
        const err = new Error("Fighter not found");
        err.status = 404;
        throw err;
      }

      res.data = fighter;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
