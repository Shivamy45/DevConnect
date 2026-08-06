import {
	createCollaborationApplication,
	createCollaborationInvitation,
	listIncomingCollaborationApplications,
	listIncomingCollaborationInvitations,
	listOutgoingCollaborationApplications,
	listOutgoingCollaborationInvitations,
	updateCollaborationRequestAccepted,
	updateCollaborationRequestCancelled,
	updateCollaborationRequestRejected,
} from "../services/collaborationRequest.service.js";

export const applyToProjectController = async (req, res) => {
	const result = await createCollaborationApplication(
		req.user.id,
		req.body,
	);
	res.status(201).json({
		success: true,
		message: "Collaboration application submitted successfully",
		data: result,
	});
};

export const inviteToProjectController = async (req, res) => {
	const result = await createCollaborationInvitation(req.user.id, req.body);
	res.status(201).json({
		success: true,
		message: "Collaboration invitation sent successfully",
		data: result,
	});
};

export const updateCollaborationRequestAcceptedController = async (
	req,
	res,
) => {
	const result = await updateCollaborationRequestAccepted(
		req.user.id,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Collaboration request accepted",
		data: result,
	});
};

export const updateCollaborationRequestRejectedController = async (
	req,
	res,
) => {
	const result = await updateCollaborationRequestRejected(
		req.user.id,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Collaboration request rejected",
		data: result,
	});
};

export const updateCollaborationRequestCancelledController = async (
	req,
	res,
) => {
	const result = await updateCollaborationRequestCancelled(
		req.user.id,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Collaboration request cancelled",
		data: result,
	});
};

export const listOutgoingCollaborationApplicationsController = async (
	req,
	res,
) => {
	const result = await listOutgoingCollaborationApplications(req.user.id);
	res.status(200).json({
		success: true,
		message: "Outgoing collaboration applications retrieved successfully",
		data: result,
	});
};

export const listIncomingCollaborationApplicationsController = async (
	req,
	res,
) => {
	const result = await listIncomingCollaborationApplications(req.user.id);
	res.status(200).json({
		success: true,
		message: "Incoming collaboration applications retrieved successfully",
		data: result,
	});
};

export const listIncomingCollaborationInvitationsController = async (
	req,
	res,
) => {
	const result = await listIncomingCollaborationInvitations(req.user.id);
	res.status(200).json({
		success: true,
		message: "Incoming collaboration invitations",
		data: result,
	});
};

export const listOutgoingCollaborationInvitationsController = async (
	req,
	res,
) => {
	const result = await listOutgoingCollaborationInvitations(req.user.id);
	res.status(200).json({
		success: true,
		message: "Outgoing collaboration invitations",
		data: result,
	});
};
