// routes for managing/checking/setting up source database connections
// import pg from 'pg';
import express from 'express';
const router = express.Router();

// route for checking that the database is accessible

// REQUEST
// METHOD: POST
// BODY: client sends source info as JSON with the following:
// connection name
// server IP address
// PORT number
// Database user
// Database password

// RESPONSE
// if incorrect credentials or just can't work for some reason, return 401
// if correct, return 200 with JSON of all the tables, columns, schema back to user
// Do NOT save the info yet in the backend (on some db). We just want to ping the remote DB to ensure the connection works.

router.post('/source', async (req, res) => {
  const source = req.body;

  // needs to look like this (this should be the structure we get back from the client):
  // const client = new Client({
  //   user: 'username',
  //   password: 'password',
  //   host: 'host',
  //   port: 'port_number',
  //   database: 'database_name',
  // });

  // verify the connection with the database

  try {
    // connect to the database
    // retrieve tables, columns, schema
    // respond with 200 and send the data back
  } catch {
    res.status(401);
  }

  //respond appropriately
});

// route for setting up database connection

// REQUEST
// METHOD: POST
// BODY: client sends info on what tables and other settings for source connector
// name of connection
// server IP address
// PORT
// Database user
// Database password
// name of tables of interest
// which columns for each table (?)

// RESPONSE
// if incorrect, return 400. Could not set up the source DB connector.
// if correct (was able to set up the source DB connector), create the kafka connect connection. return 200 and give some positive message affirming so.

export default router;
