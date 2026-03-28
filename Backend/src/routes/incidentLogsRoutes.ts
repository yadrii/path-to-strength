import express from "express";
import { Incident } from "../models/incidentLogs";
import { User } from "../models/User";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// Helper functions
const sendError = (res: express.Response, status: number, message: string) => {
  return res.status(status).json({ success: false, message, data: null });
};

const sendSuccess = (
  res: express.Response,
  status: number,
  message: string,
  data?: any,
) => {
  return res.status(status).json({ success: true, message, data });
};

// Support messages based on incident type
const getSupportMessage = (type: string): string => {
  const messages: Record<string, string> = {
    court_delay: "Court delays are exhausting. Your patience is strength, not weakness.",
    police_dismissal: "Being dismissed by those meant to protect you is deeply painful. Your experience is valid. This is documented.",
    threat: "Your safety comes first. Consider reaching out to the safety planning module.",
    other: "Whatever you are feeling right now is valid. You are not alone.",
  };
  return messages[type] || messages.other;
};

// ==================== GET ALL INCIDENTS ====================
router.get("/", verifyToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;

    const query = role === 'ngo' ? {} : { userId };

    const incidents = await Incident.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    const formattedIncidents = incidents.map(incident => ({
      id: incident._id,
      date: incident.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      type: incident.type,
      description: incident.description,
      supportMessage: incident.supportMessage,
      userName: incident.isAnonymous ? "Anonymous" : (incident.userId as any)?.name || "Unknown",
      isAnonymous: incident.isAnonymous,
      status: incident.status,
      likes: incident.likes.length,
      comments: incident.comments.map(comment => ({
        id: comment._id,
        userName: comment.userName,
        text: comment.text,
        createdAt: comment.createdAt
      })),
      createdAt: incident.createdAt
    }));

    return sendSuccess(res, 200, "Incidents retrieved successfully", formattedIncidents);
  } catch (error: any) {
    console.error("Get incidents error:", error);
    return sendError(res, 500, error.message);
  }
});

// ==================== CREATE INCIDENT ====================
router.post("/", verifyToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const { type, description } = req.body;

    // Validation
    if (!type || !description) {
      return sendError(res, 400, "Type and description are required");
    }

    if (!['court_delay', 'police_dismissal', 'threat', 'other'].includes(type)) {
      return sendError(res, 400, "Invalid incident type");
    }

    // Get user name for future comments
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const supportMessage = getSupportMessage(type);

    const { isAnonymous = false } = req.body;

    const incident = new Incident({
      userId,
      type,
      description,
      supportMessage,
      isAnonymous,
      status: 'pending',
      likes: [],
      comments: []
    });

    await incident.save();

    const formattedIncident = {
      id: incident._id,
      date: incident.date.toISOString().split('T')[0],
      type: incident.type,
      description: incident.description,
      supportMessage: incident.supportMessage,
      userName: incident.isAnonymous ? 'Anonymous' : user.name,
      isAnonymous: incident.isAnonymous,
      status: incident.status,
      likes: 0,
      comments: [],
      createdAt: incident.createdAt
    };

    return sendSuccess(res, 201, "Incident logged successfully", formattedIncident);
  } catch (error: any) {
    console.error("Create incident error:", error);
    return sendError(res, 500, error.message);
  }
});

// ==================== LIKE/UNLIKE INCIDENT ====================
router.post("/:id/like", verifyToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const incidentId = req.params.id;

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return sendError(res, 404, "Incident not found");
    }

    // Check if user already liked
    const likeIndex = incident.likes.indexOf(userId as any);

    if (likeIndex > -1) {
      // Unlike
      incident.likes.splice(likeIndex, 1);
    } else {
      // Like
      incident.likes.push(userId as any);
    }

    await incident.save();

    return sendSuccess(res, 200, likeIndex > -1 ? "Incident unliked" : "Incident liked", {
      likes: incident.likes.length
    });
  } catch (error: any) {
    console.error("Like incident error:", error);
    return sendError(res, 500, error.message);
  }
});

// ==================== ADD COMMENT ====================
router.post("/:id/comments", verifyToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const incidentId = req.params.id;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return sendError(res, 400, "Comment text is required");
    }

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return sendError(res, 404, "Incident not found");
    }

    // Get user name
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const newComment = {
      userId,
      userName: user.name,
      text: text.trim(),
      createdAt: new Date()
    };

    incident.comments.push(newComment as any);
    await incident.save();

    const addedComment = incident.comments[incident.comments.length - 1];

    return sendSuccess(res, 201, "Comment added successfully", {
      id: addedComment._id,
      userName: addedComment.userName,
      text: addedComment.text,
      createdAt: addedComment.createdAt
    });
  } catch (error: any) {
    console.error("Add comment error:", error);
    return sendError(res, 500, error.message);
  }
});

// ==================== DELETE COMMENT ====================
router.delete("/:id/comments/:commentId", verifyToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    const incidentId = req.params.id;
    const commentId = req.params.commentId;

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return sendError(res, 404, "Incident not found");
    }

    const commentIndex = incident.comments.findIndex(
      comment => comment._id?.toString() === commentId && comment.userId.toString() === userId
    );

    if (commentIndex === -1) {
      return sendError(res, 404, "Comment not found or not authorized to delete");
    }

    incident.comments.splice(commentIndex, 1);
    await incident.save();

    return sendSuccess(res, 200, "Comment deleted successfully");
  } catch (error: any) {
    console.error("Delete comment error:", error);
    return sendError(res, 500, error.message);
  }
});

// ==================== UPDATE INCIDENT STATUS ====================
router.put("/:id/status", verifyToken, async (req: express.Request, res: express.Response) => {
  try {
    const role = (req as any).user.role;
    const incidentId = req.params.id;
    const { status } = req.body;

    if (role !== "ngo") {
      return sendError(res, 403, "Only NGO users can update incident status");
    }

    if (!status || !["pending", "in_progress", "resolved"].includes(status)) {
      return sendError(res, 400, "Invalid status");
    }

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return sendError(res, 404, "Incident not found");
    }

    incident.status = status;
    await incident.save();

    return sendSuccess(res, 200, "Status updated successfully", { status: incident.status });
  } catch (error: any) {
    console.error("Update incident status error:", error);
    return sendError(res, 500, error.message);
  }
});

export default router;