import express from "express";

import { getAllRecordsHandler } from "../controllers/records";

const router = express.Router();

router.get("/", getAllRecordsHandler);

export default router;
