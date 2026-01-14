// backend/controllers/ticketController.js
const Ticket = require("../models/Ticket");

// 🎯 Create new ticket
const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      createdBy: req.user._id, // ✅ automatically assign logged-in user
    });
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🎯 Get all tickets
const getTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === "admin") {
      // ✅ Admin can see all tickets
      tickets = await Ticket.find().populate("createdBy", "name email role");
    } else {
      // ✅ Normal user can see only their tickets
      tickets = await Ticket.find({ createdBy: req.user._id });
    }
    res.json(tickets);
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🎯 Get single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // ✅ User can only view their own ticket
    if (req.user.role !== "admin" && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this ticket" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Get ticket by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🎯 Update ticket (Admin only)
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // ✅ Only admin can update
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update tickets" });
    }

    const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🎯 Delete ticket (Admin only)
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // ✅ Only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete tickets" });
    }

    await ticket.deleteOne();
    res.json({ message: "Ticket removed" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
