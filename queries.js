const Pool = require("pg").Pool;
// This line imports the `Pool` class from the `pg` module.

require('dotenv').config({ path: '.env.local' });
// This line loads the environment variables from the `.env.local` file.

const { PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD} = process.env;
// This line defines the environment variables that are used to connect to the PostgreSQL database.

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  // Add the sslmode option to the connection pool configuration
  sslmode: "require",
  // user : 'yogesh',
  // host: 'localhost',
  // database: 'api',
  // password: '123',
  // port: '5432'
});
// This line creates a new `Pool` object and connects it to the PostgreSQL database.

const getUsers = (request, response) => {
  // This function gets all the users from the PostgreSQL database.

  pool.query(
    "SELECT * FROM customer_data ORDER BY id ASC",
    (error, results) => {
      // Throws an error if there is an error with the query.
      if (error) {
        throw error;
      }
      // Sends a 200 OK response with the results of the query.
      response.status(200).json(results.rows);
    }
  );
};

const getAuth0Users = (request, response) => {
  // This function gets all the users from the PostgreSQL database whose auth0_id is not null.

  pool.query(
    "SELECT auth0_id FROM customer_data ORDER BY id ASC",
    (error, results) => {
      // Throws an error if there is an error with the query.
      if (error) {
        throw error;
      }
      // Sends a 200 OK response with the results of the query.
      response.status(200).json(results.rows);
    }
  );
};

const getGeoJson = (request, response) => {
  // This function gets all the geojson data from the PostgreSQL database.

  pool.query("SELECT geojson FROM customer_data", (error, results) => {
    // Throws an error if there is an error with the query.
    if (error) {
      console.error(error);
      response.status(500).send("Internal server error");
    } else {
      // Convert the rows to GeoJSON features.
      const features = results.rows.map((row) => row.geojson);

      // Create a GeoJSON feature collection.
      const featureCollection = {
        type: "FeatureCollection",
        features: features,
      };

      // Return the GeoJSON feature collection.
      response.status(200).json(featureCollection);
    }
  });
};

const getUserById = (request, response) => {
  // This function gets the user with the specified ID from the PostgreSQL database.

  const id = parseInt(request.params.id);
  console.log(id);

  pool.query(
    "SELECT * FROM customer_data WHERE id = $1",
    [id],
    (error, results) => {
      // Throws an error if there is an error with the query.
      if (error) {
        throw error;
      }
      // Sends a 200 OK response with the results of the query.
      response.status(200).json(results.rows);
    }
  );
};

const getUserByauth0Id = (request, response) => {
  // This function gets the user with the specified auth0_id from the PostgreSQL database.

  const auth0Id = request.params.auth0_id;
  console.log(auth0Id);

  pool.query(
    "SELECT * FROM customer_data WHERE auth0_id = $1",
    [auth0Id],
    (error, results) => {
      // Throws an error if there is an error with the query.
      if (error) {
        throw error;
      }
      // Sends a 200 OK response with the results of the query.
      response.status(200).json(results.rows);
    }
  );
};


const createUser = (request, response) => {
  // This function creates a new user in the PostgreSQL database.

  const { name, phone, geojson, auth0_id } = request.body;
  // Gets the user data from the request body.

  console.log(request.body);
  // Prints the user data to the console.

  pool.query(
    "INSERT INTO customer_data (name, phone, geojson, auth0_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, phone, geojson, auth0_id],
    (error, results) => {
      //$1 is a numbered placeholder that PostgreSQL uses natively instead of the ? placeholder
      if (error) {
        throw error;
      }
      // Throws an error if there is an error with the query.

      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
      // Sends a 201 Created response with the ID of the new user.
      console.log(`User added with ID: ${results.rows[0].id}`);
      // Prints the ID of the new user to the console.
    }
  );
};

const updateUser = (request, response) => {
  // This function updates an existing user in the PostgreSQL database.

  const id = parseInt(request.params.id);
  // Gets the user ID from the request parameters.

  const { name, phone, geojson } = request.body;
  // Gets the user data from the request body.

  console.log(`update req recieved for userid:${id}`);
  // Prints the user ID to the console.

  pool.query(
    "UPDATE customer_data SET name = $1, phone = $2 , geojson = $3 WHERE id = $4",
    [name, phone, geojson, id],
    (error, results) => {
      // Throws an error if there is an error with the query.
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
      // Sends a 200 OK response with the ID of the modified user.
    }
  );
};

const deleteUser = (request, response) => {
  // This function deletes a user from the PostgreSQL database.

  const id = parseInt(request.params.id);
  // Gets the user ID from the request parameters.

  pool.query(
    "DELETE FROM customer_data WHERE id = $1",
    [id],
    (error, results) => {
      // Throws an error if there is an error with the query.
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${id}`);
      // Sends a 200 OK response with the ID of the deleted user.
    }
  );
};


module.exports = {
  getUsers,
  getAuth0Users,
  getUserById,
  getUserByauth0Id,
  createUser,
  updateUser,
  deleteUser,
  getGeoJson,
};
