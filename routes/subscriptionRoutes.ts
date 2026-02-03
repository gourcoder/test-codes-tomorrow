import express from "express";
import { addSubscription } from "../controllers/subscriptionController";

const router = express.Router();


router.post("/newSubscription",addSubscription);

export default router;
