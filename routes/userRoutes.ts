import express from "express";
import { billingSummmary, createUser, currentUsage, getUser } from "../controllers/userControllers";
const router = express.Router();

router.post("/user",createUser);
router.get("/user/:id",getUser);
router.get("/user/:id/current-usage",currentUsage)
router.get("/users/:id/billing-summary",billingSummmary);

export default router;
