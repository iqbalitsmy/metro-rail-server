var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dtokm2yns', 
    api_key: '396841757989445', 
    api_secret: 'nkQIatVxxux4CQ4n1c08tYrVZjg'
  });

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  }

  module.exports = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      });
    });
  };