import express from "express";
import { AccountController } from "../controllers/AccountController";
import { ProductController } from "../controllers/ProductController";

const router = express.Router();

const accountController = new AccountController();
const productController = new ProductController();

router.post("/accounts/create", (req, res) => accountController.createAccount(req,res));
router.post("/accounts/login", (req, res) => accountController.login(req,res));
router.get("/accounts", (req, res) => accountController.getAccount(req,res));

router.post("/products/create", (req, res) => productController.createProduct(req,res));

export default router;
