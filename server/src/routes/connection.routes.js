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
import { createPublicIdParamSchema } from "../validations/common.validation.js";

const router = Router();

router.use(authenticateUser);

router.get("/", showAllConnectionController);

router.post(
	"/request/:publicId",
	validate(createPublicIdParamSchema("USR_", "user")),
	sendRequestController,
);

router.patch(
	"/:publicId/accept",
	validate(createPublicIdParamSchema("CON_", "connection")),
	acceptRequestController,
);
router.patch(
	"/:publicId/reject",
	validate(createPublicIdParamSchema("CON_", "connection")),
	rejectRequestController,
);
router.patch(
	"/:publicId/cancel",
	validate(createPublicIdParamSchema("CON_", "connection")),
	cancelRequestController,
);

router.delete(
	"/:publicId",
	validate(createPublicIdParamSchema("CON_", "connection")),
	deleteConnectionController,
);

router.get("/incoming", incomingRequestsController);
router.get("/outgoing", outgoingRequestsController);

export default router;
