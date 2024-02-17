const express = require("express");
const { addTicket, ticket, tickets, updateTicket, deleteTicket, deleteTickets, userTickets, cancelTicket, getCancelTickets, getNumOfCancelTickets, getTicketMail, refundRequest } = require("../controllers/ticketController");
const { userAuth, adminAuth } = require("../middleware/auth");
const { checkoutTicket } = require("../controllers/payment");
const router = express.Router();


// Payment
router.route("/payment/process").post(userAuth, checkoutTicket);

router.route("/add-ticket").post(userAuth, addTicket);

// Get user all tickets
router.route("/user-tickets").get(userAuth, userTickets);

// Get user a tickets
router.route("/ticket/:id").get(userAuth, ticket);

// Get ticket mail
router.route("/ticket-mail/:id").get(userAuth, getTicketMail);

// get all tickets
router.route("/tickets").get(adminAuth, tickets);

// update a ticket
router.route("/update-ticket/:id").put(userAuth, updateTicket);

// Cancel ticket
router.route("/cancel-ticket/:id").put(userAuth, cancelTicket);

// update ticket refund from admin
router.route("/refund-request/:id").put(adminAuth, refundRequest);

// get all cancel tickets
router.route("/cancel-tickets").get(adminAuth, getCancelTickets);
router.route("/numof-cancel-tickets").get(getNumOfCancelTickets);

router.route("/delete-ticket/:id").delete(adminAuth, deleteTicket);
router.route("/delete-tickets").delete(adminAuth, deleteTickets);



module.exports = router