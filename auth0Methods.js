// This file defines a function that updates an Auth0 user.

const axios = require("axios").default;
const { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_TOKENURL, AUTH0_AUDIENCE } =
  process.env;

// This function takes an updateRequest and an updateResponse as arguments.
// The updateRequest contains the data to be updated and the user ID of the user to be updated.
// The updateResponse is a function that will be called with the updated user data.

const updateAuth0User = (updateRequest, updateResponse) => {
  // Get the data and user ID from the updateRequest.
  const { data, userId } = updateRequest.body;

  // Create an options object for the first Axios request.
  // This request will get an access token from Auth0.
  var options = {
    method: "POST",
    url: AUTH0_TOKENURL,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: AUTH0_AUDIENCE,
    }),
  };

  // Make the first Axios request and get the access token.
  axios
    .request(options)
    .then((response) => {
      // Get the access token from the response data.
      let accessToken = response.data.access_token;

      // Log the access token.
      console.log(accessToken);

      // Create an options object for the second Axios request.
      // This request will update the Auth0 user.
      var options = {
        method: "PATCH",
        url: `${AUTH0_AUDIENCE}users/${userId}`,
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
          "cache-control": "no-cache",
        },
        data: data,
      };

      // Make the second Axios request and update the user.
      axios
        .request(options)
        .then((response) => {
          // Log the updated user data.
          console.log(response.data);

          // Set the status code of the updateResponse to 200 and
          // send the updated user data as JSON.
          updateResponse.status(200).json(response.data);
        })
        .catch((error) => {
          // Log the error.
          console.error(error);
        });
    })
    .catch((error) => {
      // Log the error.
      console.error(error);
      throw error;
    });
};

// Export the updateAuth0User function.
module.exports = { updateAuth0User };
