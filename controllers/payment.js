
const Ticket = require('../models/ticketModel');
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
// console.log("env",process.env.STRIPE_PRIVATE_KEY)

const stripe = require("stripe")("sk_test_51OfyfmCocyN0DGeBsaQOxrHU2t0MmikPuZWOVJ2goZwy7BzX3smyERDYxjPzquL8tY7RXUIoUBJQseA9nYhQq4km00x2dTVlSv");

exports.checkoutTicket = async (req, res, next) => {
    console.log("Arrive")
    const { fromStationId, toStationId, price } = req.body;
    // console.log(fromStationId, toStationId, price)
    try {
        // find from station
        const fromStation = await getDataById("station", fromStationId);
        // find to station
        const toStation = await getDataById("station", toStationId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: fromStation.name,
                    },
                    unit_amount: price,
                },
                quantity: 2,
            }],
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });
        res.json({ url: session.url })

    } catch (error) {
        res.status(500).json({ 
            message: "payment",
            error: error.message 
        })
    }
}