const Ticket = require('../models/ticketModel');
const generatePDF = require('../utils/pdfMaker');
const generateQr = require('../utils/qrCodeMaker');
const sendMail = require('../utils/sendMail');
// dotenv.config({ path: "../config/config.env" })


// get data from database
const getDataById = async (modelName, id) => {
    const Model = require(`../models/${modelName}Model`); // Assuming your model files are in the 'models' directory
    try {
        const data = await Model.findById(id);
        return data;
    } catch (error) {
        throw new Error(`An error occurred: ${error.message}`);
    }
};


// -------add Ticket-------------
exports.addTicket = async (req, res, next) => {
    const { fromStationId, toStationId, userId, price, time, payment, purchaseDate, quantity } = req.body;

    if (!(fromStationId && toStationId && userId && price && time)) {
        return res.status(400).json({
            message: "Something wrong. Please try again",
        });
    }

    try {
        // Find user
        const userData = await getDataById("user", userId);
        // find from station
        const fromStation = await getDataById("station", fromStationId);
        // find to station
        const toStation = await getDataById("station", toStationId);
        let ticket;
        // console.log(userData, fromStation, fromStation)
        if (userData && fromStation && fromStation) {
            ticket = await Ticket.create({
                fromStationId,
                toStationId,
                userId,
                price,
                payment,
                quantity,
                time,
                purchaseDate
            });
            if (ticket) {
                const data = {
                    id: ticket._id,
                    name: userData.name,
                    email: userData.email,
                    payment: userData?.payment,
                    seat: quantity,
                    from: fromStation.name,
                    to: toStation.name,
                }
                await generatePDF(data);
                // await generateQr(data);
                await sendMail(data);
            } else {
                return res.status(400).json({
                    message: "Ticket not successfully added",
                });
            }

        } else {
            return res.status(400).json({
                message: "Something wrong. Please try again 2",
            });
        }

        res.status(201).json({
            message: "Ticket successfully added",
            ticket: ticket._id,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Ticket not successfully added",
            error: error.message,
        });
    }
}


// -------get tickets email-------------
exports.getTicketMail = async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return res.status(404).json({ message: "Ticket not found" });
    }
    try {
        const ticketData = await Ticket.findById(id);

        if (!ticketData) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Find user
        const userData = await getDataById("user", ticketData.userId);
        // find from station
        const fromStation = await getDataById("station", ticketData.fromStationId);
        // find to station
        const toStation = await getDataById("station", ticketData.toStationId);
        let ticket;
        // console.log(userData, fromStation, fromStation)

        if (userData && fromStation && fromStation) {
            const data = {
                id: ticketData._id,
                name: userData?.name,
                email: userData?.email,
                payment: userData?.payment,
                seat: ticketData.quantity,
                from: fromStation?.name,
                to: toStation?.name,
            }
            await generatePDF(data);
            // await generateQr(data);
            await sendMail(data);
        } else {
            return res.status(400).json({
                message: "Something wrong. Please try again 2",
            });
        }

        res.status(201).json({
            message: "Email successfully set",
            ticket: ticketData._id,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Email not set",
            error: error.message,
        });
    }
}

// --------get user all Ticket-------------------------
exports.userTickets = async (req, res, next) => {
    const id = req.id;
    // console.log(id)
    try {
        const ticketsData = await Ticket.find({ userId: id });
        // console.log(ticketsData);
        // Map over each ticket data to fetch station information asynchronously
        let tickets = []
        tickets = await Promise.all(ticketsData.map(async (ticketData) => {
            const fromStation = await getDataById("station", ticketData.fromStationId);
            const toStation = await getDataById("station", ticketData.toStationId);

            // Return ticket object with station information
            return {
                fromStation: fromStation.name,
                toStation: toStation.name,
                ...ticketData.toObject() // Convert Mongoose document to plain JavaScript object
            };
        }));

        console.log(tickets);
        // // find from station
        // const fromStation = await getDataById("station", fromStationId);
        // // // find to station
        // const toStation = await getDataById("station", toStationId);

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// --------get all Ticket-------------------------
exports.tickets = async (req, res, next) => {
    try {
        const ticketsData = await Ticket.find();
        // console.log(ticketsData);
        let tickets = []
        tickets = await Promise.all(ticketsData.map(async (ticketData) => {
            const fromStation = await getDataById("station", ticketData.fromStationId);
            const toStation = await getDataById("station", ticketData.toStationId);
            const user = await getDataById("user", ticketData?.userId);
            // console.log(fromStation, toStation, user)
            // Return ticket object with station information
            return {
                fromStation: fromStation?.name,
                toStation: toStation?.name,
                userName: user?.name,
                ...ticketData.toObject() // Convert Mongoose document to plain JavaScript object
            };
        }));
        // console.log(tickets)

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// --------get a Ticket-------------------------
exports.ticket = async (req, res, next) => {
    const ticketId = req.params.id;
    if (!ticketId) {
        return res.status(404).json({ message: "Ticket not found" });
    }
    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const fromStation = await getDataById("station", ticket.fromStationId);
        const toStation = await getDataById("station", ticket.toStationId);

        const data = {
            ...ticket.toObject(),
            fromStation: fromStation.name,
            toStation: toStation.name,
        }
        console.log(data);

        // ticket.fromStation = fromStation;
        // ticket.toStation = toStation;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// --------update ticket-------------------------
exports.updateTicket = async (req, res, next) => {
    const { fromStationId, toStationId, userId, quantity, price, time, purchaseDate } = req.body;
    const ticketId = req.params.id;
    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            console.log("Ticket not found");
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (fromStationId) {
            ticket.fromStationId = fromStationId;
        }

        if (toStationId) {
            ticket.toStationId = toStationId;
        }

        if (price) {
            ticket.price = price;
        }
        if (quantity) {
            ticket.quantity = quantity;
        }

        if (time) {
            ticket.time = time;
        }

        if (purchaseDate) {
            ticket.purchaseDate = purchaseDate;
        }

        // Save the updated ticket
        const updatedTicket = await ticket.save();

        res.status(200).json({ message: "Ticket successfully updated", updatedTicket });
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

// --------cancel ticket-------------------------
exports.cancelTicket = async (req, res, next) => {
    const { payment, refundPaymentMethods, refundPaymentMobNumb } = req.body;
    const ticketId = req.params.id;
    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        if (payment && refundPaymentMethods && refundPaymentMobNumb) {
            ticket.payment = payment;
            ticket.refundPaymentMethods = refundPaymentMethods;
            ticket.refundPaymentMobNumb = refundPaymentMobNumb;

        } else {
            console.log("Input is missing")
            return res.status(404).json({ message: "Input is missing" });
        }

        // Save the updated ticket
        const updatedTicket = await ticket.save();

        res.status(200).json({ message: "Ticket successfully updated", updatedTicket });
    } catch (error) {
        console.log("An error occurred", error.message);
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};


// update ticket refund from admin
exports.refundRequest = async (req, res, next) => {
    const { payment } = req.body;
    const ticketId = req.params.id;
    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        if (payment) {
            ticket.payment = payment;

        } else {
            console.log("Input is missing")
            return res.status(404).json({ message: "Input is missing" });
        }

        // Save the updated ticket
        const updatedTicket = await ticket.save();

        res.status(200).json({ message: "Ticket successfully updated", updatedTicket });
    } catch (error) {
        console.log("An error occurred", error.message);
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};




// --------get cancel tickets-------------------------
exports.getCancelTickets = async (req, res, next) => {
    try {
        const cancelTickets = await Ticket.find({ payment: "request for refund" });
        // console.log(cancelTickets);
        let tickets = []
        tickets = await Promise.all(cancelTickets.map(async (ticketData) => {
            const fromStation = await getDataById("station", ticketData.fromStationId);
            const toStation = await getDataById("station", ticketData.toStationId);
            const user = await getDataById("user", ticketData.userId);

            // Return ticket object with station information
            return {
                fromStation: fromStation.name,
                toStation: toStation.name,
                userName: user.name,
                ...ticketData.toObject() // Convert Mongoose document to plain JavaScript object
            };
        }));

        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

// --------get number of cancel tickets-------------------------
exports.getNumOfCancelTickets = async (req, res, next) => {
    try {
        const cancelTickets = await Ticket.find({ payment: "request for refund" });
        // console.log(cancelTickets);
        n = cancelTickets.length;

        res.status(200).json(n);
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};


// --------delete ticket-------------------------
exports.deleteTicket = async (req, res, next) => {
    const ticketId = req.params.id;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Use deleteOne to delete the ticket
        await ticket.deleteOne();

        res.status(200).json({ message: "Ticket successfully deleted", ticket });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// --------delete tickets-------------------------
exports.deleteTickets = async (req, res, next) => {
    const { ids } = req.body;

    try {
        // Use deleteMany to delete multiple route
        const result = await Ticket.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Tickets successfully deleted", deletedCount: result.deletedCount });
        } else {
            res.status(404).json({ message: "No tickets found with the provided IDs" });
        }
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};
