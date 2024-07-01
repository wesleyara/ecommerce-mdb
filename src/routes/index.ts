import express from "express";
import { AccountController } from "../controllers/AccountController";

const router = express.Router();

const accountController = new AccountController();

router.post("/accounts/create", (req, res) => accountController.createAccount(req,res));
router.post("/accounts/login", (req, res) => accountController.login(req,res));
router.get("/accounts", (req, res) => accountController.getAccount(req,res));

export default router;
