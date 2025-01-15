import { Router } from "express";
import {
    resetDatabase
} from '../controllers/reset.db';
import {verifyEnvironment} from "../middlewares/verifyEnvironment";

const router = Router();

router.route("/reset-db").post(verifyEnvironment , resetDatabase);

export default router;