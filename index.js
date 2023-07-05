// This file defines an Express API that uses PostgreSQL and Auth0.

const express = require('express');
require('dotenv').config({ path: '.env.local' });
const bodyParser = require('body-parser');
const db = require('./queries');
const auth0 = require('./auth0Methods');
const imageKit = require('./imageKit');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;

// This middleware parses JSON and URL-encoded bodies from HTTP requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This middleware allows cross-origin requests from any domain.
app.use(cors());

// This middleware adds a header that allows the client to access the API from any origin.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// This route returns a simple message.
app.get('/', (request, response) => {
    response.send( {info: 'Node.js, Express, and Postgres API'} )
  });

// These routes use the db module to get, create, update, and delete users from the database.
app.get('/users', db.getUsers);
app.get('/users/auth0', db.getAuth0Users);
app.get('/users/auth0/:auth0_id',db.getUserByauth0Id);
app.get('/users/:id', db.getUserById);
app.get('/geojson',db.getGeoJson);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

// This route uses the auth0 module to update a user's data in Auth0.
app.post('/update-auth0-user-data',auth0.updateAuth0User);

// This route uses the imageKit module to authenticate with ImageKit.
app.get('/imagekit-auth', imageKit.imageKitAuth);

// This starts the API server on port 8080.
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
