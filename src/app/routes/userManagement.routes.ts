import { Router } from "express";
import {verifyJwtForAdmin } from "../middlewares/authMiddleWare";
import { createUser, fetchAllUserByPaginationAndSortAndFilterAndSearch } from "../controllers/userManagement.controller";

const router = Router();

router.route("/all-users").get(verifyJwtForAdmin,fetchAllUserByPaginationAndSortAndFilterAndSearch);
router.route("/create-user").post(verifyJwtForAdmin, createUser);


export default router;