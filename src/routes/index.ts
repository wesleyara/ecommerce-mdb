import express from "express";
import { AccountController } from "../controllers/AccountController";
import { ProductController } from "../controllers/ProductController";
import { CategoryController } from "../controllers/CategoryController";

const router = express.Router();

const accountController = new AccountController();
const productController = new ProductController();
const categoryController = new CategoryController();

// account routes
router.get("/accounts", (req, res) => accountController.getAccount(req,res));
router.post("/accounts/create", (req, res) => accountController.createAccount(req,res));
router.post("/accounts/login", (req, res) => accountController.login(req,res));

// product routes
router.get("/products", (req, res) => productController.getProducts(req,res));
router.post("/products/create", (req, res) => productController.createProduct(req,res));

// category routes
router.get("/categories", (req, res) => categoryController.getCategories(req,res));
router.post("/categories/create", (req, res) => categoryController.createCategory(req,res));

export default router;
