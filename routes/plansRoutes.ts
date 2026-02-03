import express from "express";
import { setPlans } from "../controllers/plansController";

const router = express.Router();

router.post("/plans",setPlans)

export default router;
