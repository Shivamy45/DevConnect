import { Router } from "express";
import {
	applyToProjectController,
	inviteToProjectController,
	listIncomingCollaborationApplicationsController,
	listIncomingCollaborationInvitationsController,
	listOutgoingCollaborationApplicationsController,
	listOutgoingCollaborationInvitationsController,
	updateCollaborationRequestAcceptedController,
	updateCollaborationRequestCancelledController,
	updateCollaborationRequestRejectedController,
} from "../controllers/collaborationRequest.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
	applyToProjectSchema,
	collaborationRequestPublicIdParamSchema,
	inviteToProjectSchema,
} from "../validations/collaborationRequest.validation.js";

const router = Router();

router.use(authenticateUser);

router.post("/apply", validate(applyToProjectSchema), applyToProjectController);
router.post(
	"/invite",
	validate(inviteToProjectSchema),
	inviteToProjectController,
);

router.get(
	"/applications/outgoing",
	listOutgoingCollaborationApplicationsController,
);
router.get(
	"/applications/incoming",
	listIncomingCollaborationApplicationsController,
);
router.get(
	"/invitations/incoming",
	listIncomingCollaborationInvitationsController,
);
router.get(
	"/invitations/outgoing",
	listOutgoingCollaborationInvitationsController,
);

router.patch(
	"/:publicId/accept",
	validate(collaborationRequestPublicIdParamSchema),
	updateCollaborationRequestAcceptedController,
);
router.patch(
	"/:publicId/reject",
	validate(collaborationRequestPublicIdParamSchema),
	updateCollaborationRequestRejectedController,
);
router.patch(
	"/:publicId/cancel",
	validate(collaborationRequestPublicIdParamSchema),
	updateCollaborationRequestCancelledController,
);

export default router;
