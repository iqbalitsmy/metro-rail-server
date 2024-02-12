const qrcode = require('qrcode');

// let data = {
//     "name": "Iqbal Hossain",
//     "email": "hello@gmail.com",
//     "gender": "male"
// };

const generateQr = (data) => {
    let stJson = JSON.stringify(data);

    qrcode.toFile(`./qrCode/${data.id}.png`, stJson, function (err) {
        if (err) return console.log("Error:", err.message)
        // console.log(code)
    })

}

module.exports = generateQr