const nodemailer = require("nodemailer");
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.net",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "saifhasanitsmy@gmail.com",
        pass: "icjtgvctdosmxiob",
    },
});


const sendMail = async (data) => {
    // console.log(data)
    const mailOptions = {
        from: {
            name: 'Dhaka Metro Rail',
            address: "saifhasanitsmy@gmail.com",
        }, // sender address
        to: `${data.email}`, // list of receivers
        subject: "Your Ticket Purchase Confirmation and QR Code", // Subject line
        text: "", // plain text body
        html: `<div><p>Dear ${data.name},<br /></p> <p>Thank you for purchasing your ticket for [Event/Flight/Show Name]! We are thrilled to have you join us for this exciting experience.<br /><br />.If you have any questions or need further assistance, feel free to reply to this email or contact our customer support at [Customer Support Email/Phone Number].</p></div>`, // html body
        attachments: [
            {
                filename: 'tickets.pdf',
                path: path.resolve(__dirname, `../pdf/${data.id}.pdf`),
                contentType: 'application/pdf'
            }
        ]
    }

    // console.log(path)
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been send successfully")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = sendMail;