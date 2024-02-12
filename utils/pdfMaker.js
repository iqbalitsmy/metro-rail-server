const fs = require('fs');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// Function to generate QR code
async function generateQRCode(data) {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(data, (err, url) => {
            if (err) reject(err);
            resolve(url);
        });
    });
}

// Function to generate PDF with user information and QR code
const generatePDF = async (userData) => {
    console.log(userData)
    const doc = new PDFDocument();
    const fileName = `./pdf/${userData.id}.pdf`;
    doc.pipe(fs.createWriteStream(fileName));

    // Add user information to the PDF
    doc.fontSize(12);
    doc.text(`Ticket ID: ${userData.id}`);
    doc.text(`Name: ${userData.name}`);
    doc.text(`Email: ${userData.email}`);
    doc.text(`From: ${userData.from}`);
    doc.text(`To: ${userData.to}`);

    // Add QR code to the PDF
    const qrCodeImage = await generateQRCode(JSON.stringify(userData));
    doc.image(qrCodeImage, 50, 150, { width: 150 });

    doc.end();
    return fileName;
}

module.exports = generatePDF

// Function to send email with PDF attachment
// async function sendEmail(userEmail, pdfFileName) {
//     const transporter = nodemailer.createTransport({
//         service: 'your_email_service_provider', // e.g., 'gmail'
//         auth: {
//             user: 'your_email_address',
//             pass: 'your_email_password',
//         },
//     });

//     const mailOptions = {
//         from: 'your_email_address',
//         to: userEmail,
//         subject: 'User Details with QR Code',
//         text: 'Please find attached user details PDF with QR code.',
//         attachments: [{
//             filename: 'user_details.pdf',
//             path: pdfFileName,
//             contentType: 'application/pdf',
//         }],
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//         } else {
//             console.log('Email sent:', info.response);
//         }
//     });
// }
