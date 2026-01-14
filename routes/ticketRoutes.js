// backend/routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// 🔐 Routes
router
  .route("/")
  // ✅ Only logged-in users can view their tickets
  .get(protect, getTickets)
  // ✅ Only 'admin' or 'user' can create tickets
  .post(protect, authorize(["admin", "user"]), createTicket);

router
  .route("/:id")
  // ✅ Both can view ticket by ID (if allowed in controller logic)
  .get(protect, getTicketById)
  // ✅ Only admin can update or delete tickets
  .put(protect, authorize("admin"), updateTicket)
  .delete(protect, authorize("admin"), deleteTicket);

module.exports = router;
