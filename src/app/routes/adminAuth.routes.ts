import { Router } from "express";
import { adminLogin, logoutAdmin, refreshAccessTokenForAdmin } from "../controllers/admin.controller";
import { verifyJwtForAdmin } from "../middlewares/authMiddleWare";

const router = Router();

router.route("/login").post(adminLogin);
router.route("/refresh-token").get(refreshAccessTokenForAdmin)
router.route("/logout").post(verifyJwtForAdmin ,logoutAdmin);

export default router;