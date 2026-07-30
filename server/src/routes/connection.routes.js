import { Router } from "express";
import {
	createConnectionRequestController,
	deleteConnectionController,
	listConnectionsController,
	listIncomingConnectionRequestsController,
	listOutgoingConnectionRequestsController,
	updateConnectionRequestAcceptedController,
	updateConnectionRequestCancelledController,
	updateConnectionRequestRejectedController,
} from "../controllers/connection.controller.js";
import validate from "../middlewares/validation.middleware.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import { publicIdParamSchema } from "../validations/common.validation.js";

const router = Router();

router.use(authenticateUser);

router.get("/", listConnectionsController);

router.post(
	"/request/:publicId",
	validate(publicIdParamSchema("USR_", "user")),
	createConnectionRequestController,
);

router.patch(
	"/:publicId/accept",
	validate(publicIdParamSchema("CON_", "connection")),
	updateConnectionRequestAcceptedController,
);
router.patch(
	"/:publicId/reject",
	validate(publicIdParamSchema("CON_", "connection")),
	updateConnectionRequestRejectedController,
);
router.patch(
	"/:publicId/cancel",
	validate(publicIdParamSchema("CON_", "connection")),
	updateConnectionRequestCancelledController,
);

router.delete(
	"/:publicId",
	validate(publicIdParamSchema("CON_", "connection")),
	deleteConnectionController,
);

router.get("/incoming", listIncomingConnectionRequestsController);
router.get("/outgoing", listOutgoingConnectionRequestsController);

export default router;
