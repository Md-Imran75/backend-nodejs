import { Router } from "express";
import {verifyJwtForAdmin } from "../../../middlewares/authMiddleWare";
import { createUser, fetchAllUserByPaginationAndSortAndFilterAndSearch, updateUser } from "../controllers/userManagement.controller";

const router = Router();

router.route("/all-users").get(verifyJwtForAdmin,fetchAllUserByPaginationAndSortAndFilterAndSearch);
router.route("/create-user").post(verifyJwtForAdmin, createUser);
router.route("/update-user").put(verifyJwtForAdmin, updateUser);




export default router;