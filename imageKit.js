// This file defines a function that authenticates with ImageKit.

const ImageKit = require('imagekit');
require('dotenv').config({ path: '.env' });
const { IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PUBLICKEY , IMAGEKIT_PRIVATEKEY } = process.env;

// This creates a new ImageKit instance with the URL endpoint, public key, and private key from the environment variables.
const imagekit = new ImageKit({
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    publicKey: IMAGEKIT_PUBLICKEY,
    privateKey: IMAGEKIT_PRIVATEKEY
  });

// This function gets the authentication parameters from ImageKit.
const imageKitAuth = (request, response) => {
    var result = imagekit.getAuthenticationParameters();
    response.send(result);
};

// This exports the imageKitAuth function.
module.exports = { imageKitAuth };
