import { Router } from "express";
import {
	acceptRequestController,
	cancelRequestController,
	deleteConnectionController,
	incomingRequestsController,
	outgoingRequestsController,
	rejectRequestController,
	sendRequestController,
	showAllConnectionController,
} from "../controllers/connection.controller.js";
import validate from "../middlewares/validation.middleware.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import { userPublicIdParamSchema } from "../validations/common.validation.js";

const router = Router();

router.use(authenticateUser);

router.get("/", showAllConnectionController);

router.post(
	"/request/:publicId",
	validate(userPublicIdParamSchema),
	sendRequestController,
);

router.patch("/:publicId/accept", acceptRequestController);
router.patch("/:publicId/reject", rejectRequestController);
router.patch("/:publicId/cancel", cancelRequestController);

router.delete("/:publicId", deleteConnectionController);

router.get("/incoming", incomingRequestsController);
router.get("/outgoing", outgoingRequestsController);

export default router;
