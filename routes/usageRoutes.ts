import express from "express";
import { usageEntry } from "../controllers/usageController";

const router = express.Router();


router.post("/",usageEntry);

export default router;
